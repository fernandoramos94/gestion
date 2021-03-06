/**
 * DevExtreme (integration/jquery/deferred.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../../core/renderer"),
    commonUtils = require("../../core/utils/common"),
    compareVersion = require("../../core/utils/version").compare;
exports.fromPromise = function(promise, context) {
    var isDeferred = promise && commonUtils.isFunction(promise.done) && commonUtils.isFunction(promise.fail);
    if (isDeferred) {
        return promise
    }
    var d = $.Deferred();
    promise.then(function() {
        d.resolveWith.apply(d, [context].concat([$.makeArray(arguments)]))
    }, function() {
        d.rejectWith.apply(d, [context].concat([$.makeArray(arguments)]))
    });
    return d
};
exports.when = compareVersion($.fn.jquery, [3]) < 0 ? $.when : function(singleArg) {
    if (0 === arguments.length) {
        return $.Deferred().resolve()
    } else {
        if (1 === arguments.length) {
            return singleArg && singleArg.then ? singleArg : $.Deferred().resolve(singleArg)
        } else {
            return $.when.apply($, arguments)
        }
    }
};
