/**
 * DevExtreme (core/utils/type.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var isEmptyObject = function(object) {
    var property;
    for (property in object) {
        return false
    }
    return true
};
var isPlainObject = function(object) {
    if (!object || "[object Object]" !== Object.prototype.toString.call(object)) {
        return false
    }
    var proto = Object.getPrototypeOf(object),
        ctor = Object.hasOwnProperty.call(proto, "constructor") && proto.constructor;
    return "function" === typeof ctor && Object.toString.call(ctor) === Object.toString.call(Object)
};
exports.isEmptyObject = isEmptyObject;
exports.isPlainObject = isPlainObject;
