/**
 * DevExtreme (ui/grid_core/ui.grid_core.state_storing.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../../core/renderer"),
    modules = require("./ui.grid_core.modules"),
    errors = require("../widget/ui.errors"),
    browser = require("../../core/utils/browser"),
    sessionStorage = require("../../core/utils/storage").sessionStorage,
    extend = require("../../core/utils/extend").extend,
    commonUtils = require("../../core/utils/common"),
    typeUtils = require("../../core/utils/type");
var DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/;
var parseDates = function(state) {
    if (!state) {
        return
    }
    $.each(state, function(key, value) {
        var date;
        if (typeUtils.isPlainObject(value) || Array.isArray(value)) {
            parseDates(value)
        } else {
            if ("string" === typeof value) {
                date = DATE_REGEX.exec(value);
                if (date) {
                    state[key] = new Date(Date.UTC(+date[1], +date[2] - 1, +date[3], +date[4], +date[5], +date[6]))
                }
            }
        }
    })
};
exports.StateStoringController = modules.ViewController.inherit(function() {
    var getStorage = function(options) {
        var storage = "sessionStorage" === options.type ? sessionStorage() : localStorage;
        if (!storage) {
            if ("file:" === window.location.protocol && browser.msie) {
                throw new Error("E1038")
            } else {
                throw new Error("E1007")
            }
        }
        return storage
    };
    var getUniqueStorageKey = function(options) {
        return commonUtils.isDefined(options.storageKey) ? options.storageKey : "storage"
    };
    return {
        _loadState: function() {
            var options = this.option("stateStoring");
            if ("custom" === options.type) {
                return options.customLoad && options.customLoad()
            }
            try {
                return JSON.parse(getStorage(options).getItem(getUniqueStorageKey(options)))
            } catch (e) {
                errors.log(e.message)
            }
        },
        _saveState: function(state) {
            var options = this.option("stateStoring");
            if ("custom" === options.type) {
                options.customSave && options.customSave(state);
                return
            }
            try {
                getStorage(options).setItem(getUniqueStorageKey(options), JSON.stringify(state))
            } catch (e) {}
        },
        publicMethods: function() {
            return ["state"]
        },
        isEnabled: function() {
            return this.option("stateStoring.enabled")
        },
        init: function() {
            var that = this;
            that._state = {};
            that._isLoaded = false;
            that._isLoading = false;
            that._windowUnloadHandler = function() {
                if (void 0 !== that._savingTimeoutID) {
                    that._saveState(that.state())
                }
            };
            $(window).on("unload", that._windowUnloadHandler);
            return that
        },
        isLoaded: function() {
            return this._isLoaded
        },
        isLoading: function() {
            return this._isLoading
        },
        load: function() {
            var loadResult, that = this;
            that._isLoading = true;
            loadResult = that._loadState();
            if (!loadResult || !commonUtils.isFunction(loadResult.done)) {
                loadResult = $.Deferred().resolve(loadResult)
            }
            loadResult.done(function(state) {
                that._isLoaded = true;
                that._isLoading = false;
                that.state(state)
            });
            return loadResult
        },
        state: function(state) {
            var that = this;
            if (!arguments.length) {
                return extend(true, {}, that._state)
            } else {
                that._state = extend({}, state);
                parseDates(that._state)
            }
        },
        save: function() {
            var that = this;
            clearTimeout(that._savingTimeoutID);
            that._savingTimeoutID = setTimeout(function() {
                that._saveState(that.state());
                that._savingTimeoutID = void 0
            }, that.option("stateStoring.savingTimeout"))
        },
        optionChanged: function(args) {
            var that = this;
            switch (args.name) {
                case "stateStoring":
                    if (that.isEnabled() && !that.isLoading()) {
                        that.load()
                    }
                    args.handled = true;
                    break;
                default:
                    that.callBase(args)
            }
        },
        dispose: function() {
            clearTimeout(this._savingTimeoutID);
            $(window).off("unload", this._windowUnloadHandler)
        }
    }
}());
