/**
 * DevExtreme (core/utils/browser.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var extend = require("./extend").extend;
var webkitRegExp = /(webkit)[ \/]([\w.]+)/,
    ieRegExp = /(msie) (\d{1,2}\.\d)/,
    ie11RegExp = /(trident).*rv:(\d{1,2}\.\d)/,
    msEdge = /(edge)\/((\d+)?[\w\.]+)/,
    safari = /(safari)/i,
    mozillaRegExp = /(mozilla)(?:.*? rv:([\w.]+))/;
var browserFromUA = function(ua) {
    ua = ua.toLowerCase();
    var result = {},
        matches = ieRegExp.exec(ua) || ie11RegExp.exec(ua) || msEdge.exec(ua) || ua.indexOf("compatible") < 0 && mozillaRegExp.exec(ua) || webkitRegExp.exec(ua) || [],
        browserName = matches[1],
        browserVersion = matches[2];
    if ("webkit" === browserName && ua.indexOf("chrome") < 0 && safari.exec(ua)) {
        browserName = "safari";
        result.webkit = true;
        browserVersion = /Version\/([0-9.]+)/i.exec(ua);
        browserVersion = browserVersion && browserVersion[1]
    }
    if ("trident" === browserName || "edge" === browserName) {
        browserName = "msie"
    }
    if (browserName) {
        result[browserName] = true;
        result.version = browserVersion
    }
    return result
};
module.exports = extend({
    _fromUA: browserFromUA
}, browserFromUA(navigator.userAgent));
