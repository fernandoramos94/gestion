/**
 * DevExtreme (core/polyfills/promise.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../../core/renderer"),
    Promise = window.Promise;
if (!Promise) {
    Promise = function(resolver) {
        var d = $.Deferred();
        resolver(d.resolve.bind(this), d.reject.bind(this));
        return d.promise()
    };
    Promise.resolve = function(val) {
        return $.Deferred().resolve(val).promise()
    };
    Promise.reject = function(val) {
        return $.Deferred().reject(val).promise()
    };
    Promise.all = function(promises) {
        return $.when.apply($, promises).then(function() {
            return $.makeArray(arguments)
        })
    }
}
module.exports = Promise;
