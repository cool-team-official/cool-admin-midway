mqemitter-redis&nbsp;&nbsp;![ci](https://github.com/mcollina/mqemitter/workflows/ci/badge.svg)
===============

Redis-powered [MQEmitter](http://github.com/mcollina/mqemitter).

See [MQEmitter](http://github.com/mcollina/mqemitter) for the actual
API.

[![js-standard-style](https://raw.githubusercontent.com/feross/standard/master/badge.png)](https://github.com/feross/standard)


Install
-------

```bash
$ npm install mqemitter-redis --save
```

Example
-------

```js
var redis = require('mqemitter-redis')
var mq = redis({
  port: 12345,
  host: '12.34.56.78',
  password: 'my secret',
  db: 4
})
var msg = {
  topic: 'hello world',
  payload: 'or any other fields'
}

mq.on('hello world', function (message, cb) {
  // call callback when you are done
  // do not pass any errors, the emitter cannot handle it.
  cb()
})

// topic is mandatory
mq.emit(msg, function () {
  // emitter will never return an error
})
```

Connection String Example
-------------------------

```js
var redis = require('mqemitter-redis')
var mq = redis({
  connectionString: 'redis://:authpassword@127.0.0.1:6380/4'
})
```

## API

<a name="constructor"></a>
### MQEmitterRedis([opts])

Creates a new instance of mqemitter-redis.
It takes all the same options of [ioredis](http://npm.im/ioredis),
which is used internally to connect to Redis.

This constructor creates two connections to Redis.

Acknowledgements
----------------

Code ported from [Ascoltatori](http://github.com/mcollina/ascoltatori).

License
-------

MIT
