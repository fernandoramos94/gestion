/**
 * DevExtreme (core/config.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var extendUtils = require("./utils/extend"),
    config = {
        rtlEnabled: false,
        defaultCurrency: "USD",
        designMode: false,
        serverDecimalSeparator: ".",
        forceIsoDateParsing: true,
        wrapActionsBeforeExecute: false
    };
module.exports = function() {
    if (!arguments.length) {
        return config
    }
    extendUtils.extend(config, arguments[0])
};
module.exports.default = module.exports;
