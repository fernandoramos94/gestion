/**
 * DevExtreme (localization/core.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var dependencyInjector = require("../core/utils/dependency_injector");
module.exports = dependencyInjector({
    locale: function() {
        var currentLocale = "en";
        return function(locale) {
            if (!locale) {
                return currentLocale
            }
            currentLocale = locale
        }
    }()
});
