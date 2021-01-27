// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import '@midwayjs/web';
import 'egg';
import 'egg-onerror';
import 'egg-session';
import 'egg-i18n';
import 'egg-multipart';
import 'egg-security';
import 'egg-logrotator';
import 'egg-schedule';
import 'egg-jsonp';
import 'egg-view';
import 'midway-schedule';
import { EggPluginItem } from 'egg';
declare module 'egg' {
  interface EggPlugin {
    onerror?: EggPluginItem;
    session?: EggPluginItem;
    i18n?: EggPluginItem;
    watcher?: EggPluginItem;
    multipart?: EggPluginItem;
    security?: EggPluginItem;
    development?: EggPluginItem;
    logrotator?: EggPluginItem;
    schedule?: EggPluginItem;
    static?: EggPluginItem;
    jsonp?: EggPluginItem;
    view?: EggPluginItem;
    schedulePlus?: EggPluginItem;
  }
}