/**
 * DevExtreme (localization/currency.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var extend = require("../core/utils/extend").extend,
    numberLocalization = require("./number");
numberLocalization.inject({
    _formatNumberCore: function(value, format, formatConfig) {
        if ("currency" === format) {
            formatConfig.precision = formatConfig.precision || 0;
            return this.getCurrencySymbol().symbol + this.format(value, extend({}, formatConfig, {
                type: "fixedpoint"
            }))
        }
        return this.callBase.apply(this, arguments)
    },
    getCurrencySymbol: function() {
        return {
            symbol: "$"
        }
    },
    getOpenXmlCurrencyFormat: function() {
        return "$#,##0{0}_);\\($#,##0{0}\\)"
    }
});
