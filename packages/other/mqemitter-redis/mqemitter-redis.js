"use strict";

const Redis = require("ioredis");
const MQEmitter = require("mqemitter");
const hyperid = require("hyperid")();
const inherits = require("inherits");
const LRU = require("lru-cache");
const msgpack = require("msgpack-lite");
const EE = require("events").EventEmitter;
const Pipeline = require("ioredis-auto-pipeline");

function MQEmitterRedis(opts) {
  if (!(this instanceof MQEmitterRedis)) {
    return new MQEmitterRedis(opts);
  }

  opts = opts || {};

  this._opts = opts;

  if (opts instanceof Array) {
    this.subConn = new Redis.Cluster(opts);
    this.pubConn = new Redis.Cluster(opts);
  } else {
    this.subConn = new Redis(opts.connectionString || opts);
    this.pubConn = new Redis(opts.connectionString || opts);
  }

  this._pipeline = Pipeline(this.pubConn);

  this._topics = {};

  this._cache = new LRU({
    max: 10000,
    ttl: 60 * 1000, // one minute
  });

  this.state = new EE();

  const that = this;

  function onError(err) {
    if (err && !that.closing) {
      that.state.emit("error", err);
    }
  }

  this._onError = onError;

  function handler(sub, topic, payload) {
    const packet = msgpack.decode(payload);
    if (!that._cache.get(packet.id)) {
      that._emit(packet.msg);
    }
    that._cache.set(packet.id, true);
  }

  this.subConn.on("messageBuffer", function (topic, message) {
    handler(topic, topic, message);
  });

  this.subConn.on("pmessageBuffer", function (sub, topic, message) {
    handler(sub, topic, message);
  });

  this.subConn.on("connect", function () {
    that.state.emit("subConnect");
  });

  this.subConn.on("error", function (err) {
    that._onError(err);
  });

  this.pubConn.on("connect", function () {
    that.state.emit("pubConnect");
  });

  this.pubConn.on("error", function (err) {
    that._onError(err);
  });

  MQEmitter.call(this, opts);

  this._opts.regexWildcardOne = new RegExp(
    this._opts.wildcardOne.replace(/([/,!\\^${}[\]().*+?|<>\-&])/g, "\\$&"),
    "g"
  );
  this._opts.regexWildcardSome = new RegExp(
    (this._opts.matchEmptyLevels
      ? this._opts.separator.replace(/([/,!\\^${}[\]().*+?|<>\-&])/g, "\\$&") +
        "?"
      : "") +
      this._opts.wildcardSome.replace(/([/,!\\^${}[\]().*+?|<>\-&])/g, "\\$&"),
    "g"
  );
}

inherits(MQEmitterRedis, MQEmitter);
["emit", "on", "removeListener", "close"].forEach(function (name) {
  MQEmitterRedis.prototype["_" + name] = MQEmitterRedis.prototype[name];
});

MQEmitterRedis.prototype.close = function (cb) {
  cb = cb || noop;

  if (this.closed || this.closing) {
    return cb();
  }

  this.closing = true;

  let count = 2;
  const that = this;

  function onEnd() {
    if (--count === 0) {
      that._close(cb);
    }
  }

  this.subConn.on("end", onEnd);
  this.subConn.quit();

  this.pubConn.on("end", onEnd);
  this.pubConn.quit();

  return this;
};

MQEmitterRedis.prototype._subTopic = function (topic) {
  return topic
    .replace(this._opts.regexWildcardOne, "*")
    .replace(this._opts.regexWildcardSome, "*");
};

MQEmitterRedis.prototype.on = function on(topic, cb, done) {
  const subTopic = this._subTopic(topic);
  const onFinish = function () {
    if (done) {
      setImmediate(done);
    }
  };

  this._on(topic, cb);

  if (this._topics[subTopic]) {
    this._topics[subTopic]++;
    onFinish.call(this);
    return this;
  }

  this._topics[subTopic] = 1;

  if (this._containsWildcard(topic)) {
    this.subConn.psubscribe(subTopic, onFinish.bind(this));
  } else {
    this.subConn.subscribe(subTopic, onFinish.bind(this));
  }

  return this;
};

MQEmitterRedis.prototype.emit = function (msg, done) {
  done = done || this._onError;

  if (this.closed) {
    const err = new Error("mqemitter-redis is closed");
    return done(err);
  }

  const packet = {
    id: hyperid(),
    msg,
  };

  this._pipeline
    .publish(msg.topic, msgpack.encode(packet))
    .then(() => done())
    .catch(done);
};

MQEmitterRedis.prototype.removeListener = function (topic, cb, done) {
  const subTopic = this._subTopic(topic);
  const onFinish = function () {
    if (done) {
      setImmediate(done);
    }
  };

  this._removeListener(topic, cb);

  if (--this._topics[subTopic] > 0) {
    onFinish();
    return this;
  }

  delete this._topics[subTopic];

  if (this._containsWildcard(topic)) {
    this.subConn.punsubscribe(subTopic, onFinish);
  } else if (this._matcher.match(topic)) {
    this.subConn.unsubscribe(subTopic, onFinish);
  }

  return this;
};

MQEmitterRedis.prototype._containsWildcard = function (topic) {
  return (
    topic.indexOf(this._opts.wildcardOne) >= 0 ||
    topic.indexOf(this._opts.wildcardSome) >= 0
  );
};

function noop() {}

module.exports = MQEmitterRedis;

function MQEmitterRedisPrefix(pubSubPrefix, options) {
  MQEmitterRedis.call(this, options);
  this._pubSubPrefix = pubSubPrefix;
  this._sym_proxiedCallback = Symbol("proxiedCallback");
}
inherits(MQEmitterRedisPrefix, MQEmitterRedis);
MQEmitterRedisPrefix.prototype.on = function (topic, cb, done) {
  const t = this._pubSubPrefix + topic;
  cb[this._sym_proxiedCallback] = function (packet, cbcb) {
    const t = packet.topic.slice(this._pubSubPrefix.length);
    const p = { ...packet, topic: t };
    return cb.call(this, p, cbcb);
  }.bind(this);
  return MQEmitterRedis.prototype.on.call(
    this,
    t,
    cb[this._sym_proxiedCallback],
    done
  );
};
MQEmitterRedisPrefix.prototype.removeListener = function (topic, func, done) {
  const t = this._pubSubPrefix + topic;
  const f = func[this._sym_proxiedCallback];
  return MQEmitterRedis.prototype.removeListener.call(this, t, f, done);
};
MQEmitterRedisPrefix.prototype.emit = function (packet, done) {
  const t = this._pubSubPrefix + packet.topic;
  const p = { ...packet, topic: t };
  return MQEmitterRedis.prototype.emit.call(this, p, done);
};

module.exports.MQEmitterRedisPrefix = MQEmitterRedisPrefix;
