/**
 * DevExtreme (integration/knockout.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var ko = require("knockout");
if (ko) {
    var errors = require("../core/errors"),
        compareVersion = require("../core/utils/version").compare;
    if (compareVersion(ko.version, [2, 3]) < 0) {
        throw errors.Error("E0013")
    }
    require("./knockout/component_registrator");
    require("./knockout/event_registrator");
    require("./knockout/components");
    require("./knockout/validation");
    require("./knockout/variable_wrapper_utils");
    require("./knockout/clean_node");
    require("./knockout/clean_node_old")
}
