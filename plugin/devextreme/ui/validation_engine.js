/**
 * DevExtreme (ui/validation_engine.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../core/renderer"),
    Class = require("../core/class"),
    extend = require("../core/utils/extend").extend,
    inArray = require("../core/utils/array").inArray,
    EventsMixin = require("../core/events_mixin"),
    errors = require("../core/errors"),
    commonUtils = require("../core/utils/common"),
    numberLocalization = require("../localization/number"),
    messageLocalization = require("../localization/message");
var BaseRuleValidator = Class.inherit({
    NAME: "base",
    defaultMessage: function(value) {
        return messageLocalization.getFormatter("validation-" + this.NAME)(value)
    },
    defaultFormattedMessage: function(value) {
        return messageLocalization.getFormatter("validation-" + this.NAME + "-formatted")(value)
    },
    validate: function(value, rule) {
        var valueArray = Array.isArray(value) ? value : [value],
            result = true;
        valueArray.every(function(itemValue) {
            result = this._validate(itemValue, rule);
            return result
        }, this);
        return result
    }
});
var RequiredRuleValidator = BaseRuleValidator.inherit({
    NAME: "required",
    _validate: function(value, rule) {
        if (!commonUtils.isDefined(value)) {
            return false
        }
        if (false === value) {
            return false
        }
        value = String(value);
        if (rule.trim || !commonUtils.isDefined(rule.trim)) {
            value = $.trim(value)
        }
        return "" !== value
    }
});
var NumericRuleValidator = BaseRuleValidator.inherit({
    NAME: "numeric",
    _validate: function(value, rule) {
        if (!rulesValidators.required.validate(value, {})) {
            return true
        }
        if (rule.useCultureSettings && commonUtils.isString(value)) {
            return !isNaN(numberLocalization.parse(value))
        } else {
            return commonUtils.isNumeric(value)
        }
    }
});
var RangeRuleValidator = BaseRuleValidator.inherit({
    NAME: "range",
    _validate: function(value, rule) {
        if (!rulesValidators.required.validate(value, {})) {
            return true
        }
        var validNumber = rulesValidators.numeric.validate(value, rule),
            validValue = commonUtils.isDefined(value),
            number = validNumber ? parseFloat(value) : validValue && value.valueOf(),
            min = rule.min,
            max = rule.max;
        if (!(validNumber || commonUtils.isDate(value)) && !validValue) {
            return false
        }
        if (commonUtils.isDefined(min)) {
            if (commonUtils.isDefined(max)) {
                return number >= min && number <= max
            }
            return number >= min
        } else {
            if (commonUtils.isDefined(max)) {
                return number <= max
            } else {
                throw errors.Error("E0101")
            }
        }
    }
});
var StringLengthRuleValidator = BaseRuleValidator.inherit({
    NAME: "stringLength",
    _validate: function(value, rule) {
        value = commonUtils.isDefined(value) ? String(value) : "";
        if (rule.trim || !commonUtils.isDefined(rule.trim)) {
            value = $.trim(value)
        }
        return rulesValidators.range.validate(value.length, extend({}, rule))
    }
});
var CustomRuleValidator = BaseRuleValidator.inherit({
    NAME: "custom",
    validate: function(value, rule) {
        return rule.validationCallback({
            value: value,
            validator: rule.validator,
            rule: rule
        })
    }
});
var CompareRuleValidator = BaseRuleValidator.inherit({
    NAME: "compare",
    _validate: function(value, rule) {
        if (!rule.comparisonTarget) {
            throw errors.Error("E0102")
        }
        extend(rule, {
            reevaluate: true
        });
        var otherValue = rule.comparisonTarget(),
            type = rule.comparisonType || "==";
        switch (type) {
            case "==":
                return value == otherValue;
            case "!=":
                return value != otherValue;
            case "===":
                return value === otherValue;
            case "!==":
                return value !== otherValue;
            case ">":
                return value > otherValue;
            case ">=":
                return value >= otherValue;
            case "<":
                return value < otherValue;
            case "<=":
                return value <= otherValue
        }
    }
});
var PatternRuleValidator = BaseRuleValidator.inherit({
    NAME: "pattern",
    _validate: function(value, rule) {
        if (!rulesValidators.required.validate(value, {})) {
            return true
        }
        var pattern = rule.pattern;
        if (commonUtils.isString(pattern)) {
            pattern = new RegExp(pattern)
        }
        return pattern.test(value)
    }
});
var EmailRuleValidator = BaseRuleValidator.inherit({
    NAME: "email",
    _validate: function(value, rule) {
        if (!rulesValidators.required.validate(value, {})) {
            return true
        }
        return rulesValidators.pattern.validate(value, extend({}, rule, {
            pattern: /^[\d\w\._\-]+@([\d\w\._\-]+\.)+[\w]+$/i
        }))
    }
});
var rulesValidators = {
    required: new RequiredRuleValidator,
    numeric: new NumericRuleValidator,
    range: new RangeRuleValidator,
    stringLength: new StringLengthRuleValidator,
    custom: new CustomRuleValidator,
    compare: new CompareRuleValidator,
    pattern: new PatternRuleValidator,
    email: new EmailRuleValidator
};
var GroupConfig = Class.inherit({
    ctor: function(group) {
        this.group = group;
        this.validators = []
    },
    validate: function() {
        var result = {
            isValid: true,
            brokenRules: [],
            validators: []
        };
        $.each(this.validators, function(_, validator) {
            var validatorResult = validator.validate();
            result.isValid = result.isValid && validatorResult.isValid;
            if (validatorResult.brokenRule) {
                result.brokenRules.push(validatorResult.brokenRule)
            }
            result.validators.push(validator)
        });
        this.fireEvent("validated", [{
            validators: result.validators,
            brokenRules: result.brokenRules,
            isValid: result.isValid
        }]);
        return result
    },
    reset: function() {
        $.each(this.validators, function(_, validator) {
            validator.reset()
        })
    }
}).include(EventsMixin);
var ValidationEngine = {
    groups: [],
    getGroupConfig: function(group) {
        var result = commonUtils.grep(this.groups, function(config) {
            return config.group === group
        });
        if (result.length) {
            return result[0]
        }
    },
    initGroups: function() {
        this.groups = [];
        this.addGroup()
    },
    addGroup: function(group) {
        var config = this.getGroupConfig(group);
        if (!config) {
            config = new GroupConfig(group);
            this.groups.push(config)
        }
        return config
    },
    removeGroup: function(group) {
        var config = this.getGroupConfig(group),
            index = inArray(config, this.groups);
        if (index > -1) {
            this.groups.splice(index, 1)
        }
        return config
    },
    _setDefaultMessage: function(rule, validator, name) {
        if (!commonUtils.isDefined(rule.message)) {
            if (validator.defaultFormattedMessage && commonUtils.isDefined(name)) {
                rule.message = validator.defaultFormattedMessage(name)
            } else {
                rule.message = validator.defaultMessage()
            }
        }
    },
    validate: function(value, rules, name) {
        var result = {
                name: name,
                value: value,
                brokenRule: null,
                isValid: true,
                validationRules: rules
            },
            that = this;
        $.each(rules || [], function(_, rule) {
            var ruleValidationResult, ruleValidator = rulesValidators[rule.type];
            if (ruleValidator) {
                if (commonUtils.isDefined(rule.isValid) && rule.value === value && !rule.reevaluate) {
                    if (!rule.isValid) {
                        result.isValid = false;
                        result.brokenRule = rule;
                        return false
                    }
                    return true
                }
                rule.value = value;
                ruleValidationResult = ruleValidator.validate(value, rule);
                rule.isValid = ruleValidationResult;
                if (!ruleValidationResult) {
                    result.isValid = false;
                    that._setDefaultMessage(rule, ruleValidator, name);
                    result.brokenRule = rule
                }
                if (!rule.isValid) {
                    return false
                }
            } else {
                throw errors.Error("E0100")
            }
        });
        return result
    },
    registerValidatorInGroup: function(group, validator) {
        var groupConfig = ValidationEngine.addGroup(group);
        if (inArray(validator, groupConfig.validators) < 0) {
            groupConfig.validators.push(validator)
        }
    },
    _shouldRemoveGroup: function(group, validatorsInGroup) {
        var isDefaultGroup = void 0 === group,
            isValidationGroupInstance = group && "dxValidationGroup" === group.NAME;
        return !isDefaultGroup && !isValidationGroupInstance && !validatorsInGroup.length
    },
    removeRegisteredValidator: function(group, validator) {
        var config = ValidationEngine.getGroupConfig(group),
            validatorsInGroup = config && config.validators;
        var index = inArray(validator, validatorsInGroup);
        if (index > -1) {
            validatorsInGroup.splice(index, 1);
            if (this._shouldRemoveGroup(group, validatorsInGroup)) {
                this.removeGroup(group)
            }
        }
    },
    validateGroup: function(group) {
        var groupConfig = ValidationEngine.getGroupConfig(group);
        if (!groupConfig) {
            throw errors.Error("E0110")
        }
        return groupConfig.validate()
    },
    resetGroup: function(group) {
        var groupConfig = ValidationEngine.getGroupConfig(group);
        if (!groupConfig) {
            throw errors.Error("E0110")
        }
        return groupConfig.reset()
    }
};
ValidationEngine.initGroups();
module.exports = ValidationEngine;
module.exports.default = module.exports;
