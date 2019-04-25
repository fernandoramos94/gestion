/**
 * DevExtreme (ui/text_box/ui.text_editor.base.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../../core/renderer"),
    domUtils = require("../../core/utils/dom"),
    commonUtils = require("../../core/utils/common"),
    extend = require("../../core/utils/extend").extend,
    inArray = require("../../core/utils/array").inArray,
    themes = require("../themes"),
    Editor = require("../editor/editor"),
    eventUtils = require("../../events/utils"),
    pointerEvents = require("../../events/pointer"),
    clickEvent = require("../../events/click");
var TEXTEDITOR_CLASS = "dx-texteditor",
    TEXTEDITOR_INPUT_CLASS = "dx-texteditor-input",
    TEXTEDITOR_INPUT_SELECTOR = "." + TEXTEDITOR_INPUT_CLASS,
    TEXTEDITOR_CONTAINER_CLASS = "dx-texteditor-container",
    TEXTEDITOR_BUTTONS_CONTAINER_CLASS = "dx-texteditor-buttons-container",
    TEXTEDITOR_PLACEHOLDER_CLASS = "dx-placeholder",
    TEXTEDITOR_SHOW_CLEAR_BUTTON_CLASS = "dx-show-clear-button",
    TEXTEDITOR_ICON_CLASS = "dx-icon",
    TEXTEDITOR_CLEAR_ICON_CLASS = "dx-icon-clear",
    TEXTEDITOR_CLEAR_BUTTON_CLASS = "dx-clear-button-area",
    TEXTEDITOR_EMPTY_INPUT_CLASS = "dx-texteditor-empty";
var EVENTS_LIST = ["KeyDown", "KeyPress", "KeyUp", "Change", "Cut", "Copy", "Paste", "Input"];
var CONTROL_KEYS = ["Tab", "Enter", "Shift", "Control", "Alt", "Escape", "PageUp", "PageDown", "End", "Home", "ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown", "Esc", "Left", "Up", "Right", "Down"];
var TextEditorBase = Editor.inherit({
    _supportedKeys: function() {
        var stop = function(e) {
            e.stopPropagation()
        };
        return {
            space: stop,
            enter: stop,
            leftArrow: stop,
            rightArrow: stop
        }
    },
    _setDeprecatedOptions: function() {
        this.callBase();
        extend(this._deprecatedOptions, {
            attr: {
                since: "16.2",
                alias: "inputAttr"
            }
        })
    },
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            value: "",
            spellcheck: false,
            showClearButton: false,
            valueChangeEvent: "change",
            placeholder: "",
            inputAttr: {},
            onFocusIn: null,
            onFocusOut: null,
            onKeyDown: null,
            onKeyPress: null,
            onKeyUp: null,
            onChange: null,
            onInput: null,
            onCut: null,
            onCopy: null,
            onPaste: null,
            onEnterKey: null,
            mode: "text",
            hoverStateEnabled: true,
            focusStateEnabled: true,
            text: void 0,
            valueFormat: function(value) {
                return value
            }
        })
    },
    _defaultOptionsRules: function() {
        return this.callBase().concat([{
            device: function() {
                var currentTheme = (themes.current() || "").split(".")[0];
                return "android5" === currentTheme
            },
            options: {
                validationMessageOffset: {
                    v: -8
                }
            }
        }])
    },
    _input: function() {
        return this.element().find(TEXTEDITOR_INPUT_SELECTOR).first()
    },
    _inputWrapper: function() {
        return this.element()
    },
    _buttonsContainer: function() {
        return this._inputWrapper().find("." + TEXTEDITOR_BUTTONS_CONTAINER_CLASS)
    },
    _isControlKey: function(key) {
        return CONTROL_KEYS.indexOf(key) !== -1
    },
    _render: function() {
        this.element().addClass(TEXTEDITOR_CLASS);
        this._renderInput();
        this._renderInputType();
        this._renderValue();
        this._renderProps();
        this._renderPlaceholder();
        this.callBase();
        this._refreshValueChangeEvent();
        this._renderEvents();
        this._renderEnterKeyAction();
        this._renderEmptinessEvent()
    },
    _renderInput: function() {
        $("<div>").addClass(TEXTEDITOR_CONTAINER_CLASS).append(this._createInput()).append($("<div>").addClass(TEXTEDITOR_BUTTONS_CONTAINER_CLASS)).appendTo(this.element())
    },
    _createInput: function() {
        var $input = $("<input>");
        this._applyInputAttributes($input, this.option("inputAttr"));
        return $input
    },
    _applyInputAttributes: function($input, customAttributes) {
        $input.attr("autocomplete", "off").attr(customAttributes).addClass(TEXTEDITOR_INPUT_CLASS).css("min-height", this.option("height") ? "0" : "")
    },
    _renderValue: function() {
        this._renderInputValue();
        this._renderInputAddons()
    },
    _renderInputValue: function(value) {
        value = value || this.option("value");
        var text = this.option("text"),
            displayValue = this.option("displayValue"),
            valueFormat = this.option("valueFormat");
        if (void 0 !== displayValue && null !== value) {
            text = valueFormat(displayValue)
        } else {
            if (!commonUtils.isDefined(text)) {
                text = valueFormat(value)
            }
        }
        this.option("text", text);
        if (this._input().val() !== (commonUtils.isDefined(text) ? text : "")) {
            this._renderDisplayText(text)
        } else {
            this._toggleEmptinessEventHandler()
        }
    },
    _renderDisplayText: function(text) {
        this._input().val(text);
        this._toggleEmptinessEventHandler()
    },
    _isValueValid: function() {
        if (this._input().length) {
            var validity = this._input().get(0).validity;
            if (validity) {
                return validity.valid
            }
        }
        return true
    },
    _toggleEmptiness: function(isEmpty) {
        this.element().toggleClass(TEXTEDITOR_EMPTY_INPUT_CLASS, isEmpty);
        this._togglePlaceholder(isEmpty)
    },
    _togglePlaceholder: function(isEmpty) {
        if (!this._$placeholder) {
            return
        }
        this._$placeholder.toggleClass("dx-state-invisible", !isEmpty)
    },
    _renderProps: function() {
        this._toggleDisabledState(this.option("disabled"));
        this._toggleReadOnlyState();
        this._toggleSpellcheckState()
    },
    _toggleDisabledState: function(value) {
        this.callBase.apply(this, arguments);
        var $input = this._input();
        if (value) {
            $input.attr("disabled", true).attr("tabindex", -1)
        } else {
            $input.removeAttr("disabled").removeAttr("tabindex")
        }
    },
    _toggleReadOnlyState: function() {
        this._input().prop("readOnly", this._readOnlyPropValue());
        this.callBase()
    },
    _readOnlyPropValue: function() {
        return this.option("readOnly")
    },
    _toggleSpellcheckState: function() {
        this._input().prop("spellcheck", this.option("spellcheck"))
    },
    _renderPlaceholder: function() {
        if (this._$placeholder) {
            this._$placeholder.remove();
            this._$placeholder = null
        }
        var that = this,
            $input = that._input(),
            placeholderText = that.option("placeholder"),
            $placeholder = this._$placeholder = $("<div>").attr("data-dx_placeholder", placeholderText),
            startEvent = eventUtils.addNamespace(pointerEvents.up, this.NAME);
        $placeholder.on(startEvent, function() {
            $input.focus()
        });
        $placeholder.insertAfter($input);
        $placeholder.addClass(TEXTEDITOR_PLACEHOLDER_CLASS);
        this._toggleEmptinessEventHandler()
    },
    _placeholder: function() {
        return this._$placeholder || $()
    },
    _renderInputAddons: function() {
        this._renderClearButton()
    },
    _renderClearButton: function() {
        var clearButtonVisibility = this._clearButtonVisibility();
        this.element().toggleClass(TEXTEDITOR_SHOW_CLEAR_BUTTON_CLASS, clearButtonVisibility);
        if (clearButtonVisibility) {
            if (!this._$clearButton || this._$clearButton && !this._$clearButton.closest(this.element()).length) {
                this._$clearButton = this._createClearButton()
            }
            this._$clearButton.prependTo(this._buttonsContainer())
        }
        if (this._$clearButton) {
            this._$clearButton.toggleClass("dx-state-invisible", !clearButtonVisibility)
        }
    },
    _clearButtonVisibility: function() {
        return this.option("showClearButton") && !this.option("readOnly")
    },
    _createClearButton: function() {
        return $("<span>").addClass(TEXTEDITOR_CLEAR_BUTTON_CLASS).append($("<span>").addClass(TEXTEDITOR_ICON_CLASS).addClass(TEXTEDITOR_CLEAR_ICON_CLASS)).on(eventUtils.addNamespace(pointerEvents.down, this.NAME), function(e) {
            if ("mouse" === e.pointerType) {
                e.preventDefault()
            }
        }).on(eventUtils.addNamespace(clickEvent.name, this.NAME), this._clearValueHandler.bind(this))
    },
    _clearValueHandler: function(e) {
        var $input = this._input();
        e.stopPropagation();
        this._valueChangeEventHandler(e);
        this.reset();
        !$input.is(":focus") && $input.focus();
        $input.trigger("input")
    },
    _renderEvents: function() {
        var that = this,
            $input = that._input();
        $.each(EVENTS_LIST, function(_, event) {
            if (that.hasActionSubscription("on" + event)) {
                var action = that._createActionByOption("on" + event, {
                    excludeValidators: ["readOnly"]
                });
                $input.on(eventUtils.addNamespace(event.toLowerCase(), that.NAME), function(e) {
                    if (that._disposed) {
                        return
                    }
                    action({
                        jQueryEvent: e
                    })
                })
            }
        })
    },
    _refreshEvents: function() {
        var that = this,
            $input = this._input();
        $.each(EVENTS_LIST, function(_, event) {
            $input.off(eventUtils.addNamespace(event.toLowerCase(), that.NAME))
        });
        this._renderEvents()
    },
    _keyPressHandler: function() {
        this.option("text", this._input().val())
    },
    _renderValueChangeEvent: function() {
        var keyPressEvent = eventUtils.addNamespace(this._renderValueEventName(), this.NAME + "TextChange"),
            valueChangeEvent = eventUtils.addNamespace(this.option("valueChangeEvent"), this.NAME + "ValueChange");
        this._input().on(keyPressEvent, this._keyPressHandler.bind(this)).on(valueChangeEvent, this._valueChangeEventHandler.bind(this))
    },
    _cleanValueChangeEvent: function() {
        var eventNamespace = this.NAME + "ValueChange",
            keyPressEvent = eventUtils.addNamespace(this._renderValueEventName(), this.NAME + "TextChange");
        this._input().off("." + eventNamespace).off(keyPressEvent)
    },
    _refreshValueChangeEvent: function() {
        this._cleanValueChangeEvent();
        this._renderValueChangeEvent()
    },
    _renderValueEventName: function() {
        return "input change keypress"
    },
    _focusTarget: function() {
        return this._input()
    },
    _focusClassTarget: function() {
        return this.element()
    },
    _toggleFocusClass: function(isFocused, $element) {
        this.callBase(isFocused, this._focusClassTarget($element))
    },
    _hasFocusClass: function(element) {
        return this.callBase($(element || this.element()))
    },
    _renderEmptinessEvent: function() {
        var $input = this._input();
        $input.on("input blur", this._toggleEmptinessEventHandler.bind(this))
    },
    _toggleEmptinessEventHandler: function() {
        var text = this._input().val(),
            isEmpty = ("" === text || null === text) && this._isValueValid();
        this._toggleEmptiness(isEmpty)
    },
    _valueChangeEventHandler: function(e, formattedValue) {
        this._saveValueChangeEvent(e);
        this.option("value", arguments.length > 1 ? formattedValue : this._input().val())
    },
    _renderEnterKeyAction: function() {
        this._enterKeyAction = this._createActionByOption("onEnterKey", {
            excludeValidators: ["readOnly"]
        });
        this._input().off("keyup.onEnterKey.dxTextEditor").on("keyup.onEnterKey.dxTextEditor", this._enterKeyHandlerUp.bind(this))
    },
    _enterKeyHandlerUp: function(e) {
        if (this._disposed) {
            return
        }
        if (13 === e.which) {
            this._enterKeyAction({
                jQueryEvent: e
            })
        }
    },
    _updateValue: function() {
        this.option("text", void 0);
        this._renderValue()
    },
    _dispose: function() {
        this._enterKeyAction = void 0;
        this.callBase()
    },
    _getSubmitElement: function() {
        return this._input()
    },
    _optionChanged: function(args) {
        var name = args.name;
        if (inArray(name.replace("on", ""), EVENTS_LIST) > -1) {
            this._refreshEvents();
            return
        }
        switch (name) {
            case "valueChangeEvent":
                this._refreshValueChangeEvent();
                this._refreshFocusEvent();
                this._refreshEvents();
                break;
            case "onValueChanged":
                this._createValueChangeAction();
                break;
            case "readOnly":
                this.callBase(args);
                this._renderInputAddons();
                break;
            case "spellcheck":
                this._toggleSpellcheckState();
                break;
            case "mode":
                this._renderInputType();
                break;
            case "onEnterKey":
                this._renderEnterKeyAction();
                break;
            case "placeholder":
                this._renderPlaceholder();
                break;
            case "showClearButton":
                this._renderInputAddons();
                break;
            case "text":
                break;
            case "value":
                this._updateValue();
                this.callBase(args);
                break;
            case "inputAttr":
                this._applyInputAttributes(this._input(), args.value);
                break;
            case "valueFormat":
                this._invalidate();
                break;
            default:
                this.callBase(args)
        }
    },
    _renderInputType: function() {
        this._setInputType(this.option("mode"))
    },
    _setInputType: function(type) {
        var input = this._input();
        if ("search" === type) {
            type = "text"
        }
        try {
            input.prop("type", type)
        } catch (e) {
            input.prop("type", "text")
        }
    },
    focus: function() {
        this._input().focus()
    },
    blur: function() {
        if (this._input().is(document.activeElement)) {
            domUtils.resetActiveElement()
        }
    },
    reset: function() {
        this.option("value", "")
    },
    on: function(eventName, eventHandler) {
        var result = this.callBase(eventName, eventHandler),
            event = eventName.charAt(0).toUpperCase() + eventName.substr(1);
        if (EVENTS_LIST.indexOf(event) >= 0) {
            this._refreshEvents()
        }
        return result
    }
});
module.exports = TextEditorBase;