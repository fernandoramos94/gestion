/**
 * DevExtreme (mobile/process_hardware_back_button.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../core/renderer"),
    hardwareBack = $.Callbacks();
module.exports = function() {
    hardwareBack.fire()
};
module.exports.processCallback = hardwareBack;
module.exports.default = module.exports;
