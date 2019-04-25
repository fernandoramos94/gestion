/**
 * DevExtreme (integration/angular/action_executors.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var Action = require("../../core/action");
Action.registerExecutor({
    ngExpression: {
        execute: function(e) {
            if ("string" === typeof e.action) {
                e.context.$eval(e.action)
            }
        }
    }
});
