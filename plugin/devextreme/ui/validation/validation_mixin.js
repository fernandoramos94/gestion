/**
 * DevExtreme (ui/validation/validation_mixin.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var ValidationMixin = {
    _findGroup: function() {
        var $dxGroup, group = this.option("validationGroup");
        if (!group) {
            $dxGroup = this.element().parents(".dx-validationgroup").first();
            if ($dxGroup.length) {
                group = $dxGroup.dxValidationGroup("instance")
            } else {
                group = this._modelByElement(this.element())
            }
        }
        return group
    }
};
module.exports = ValidationMixin;
