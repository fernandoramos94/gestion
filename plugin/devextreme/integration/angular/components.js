/**
 * DevExtreme (integration/angular/components.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../../core/renderer"),
    ngModule = require("./module");
ngModule.service("dxDigestCallbacks", ["$rootScope", function($rootScope) {
    var begin = $.Callbacks(),
        end = $.Callbacks();
    var digestPhase = false;
    $rootScope.$watch(function() {
        if (digestPhase) {
            return
        }
        digestPhase = true;
        begin.fire();
        $rootScope.$$postDigest(function() {
            digestPhase = false;
            end.fire()
        })
    });
    return {
        begin: {
            add: function(callback) {
                if (digestPhase) {
                    callback()
                }
                begin.add(callback)
            },
            remove: begin.remove
        },
        end: end
    }
}]);
