/**
 * DevExtreme (data/odata/utils.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../../core/renderer"),
    Class = require("../../core/class"),
    extend = require("../../core/utils/extend").extend,
    commonUtils = require("../../core/utils/common"),
    typeUtils = require("../../core/utils/type"),
    Guid = require("../../core/guid"),
    isDefined = commonUtils.isDefined,
    errors = require("../errors").errors,
    dataUtils = require("../utils");
var GUID_REGEX = /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/;
var VERBOSE_DATE_REGEX = /^\/Date\((-?\d+)((\+|-)?(\d+)?)\)\/$/;
var ISO8601_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[-+]{1}\d{2}(:?)(\d{2})?)?$/;
var JSON_VERBOSE_MIME_TYPE = "application/json;odata=verbose";

function formatISO8601(date, skipZeroTime, skipTimezone) {
    var bag = [];
    var pad = function(n) {
        if (n < 10) {
            return "0".concat(n)
        }
        return String(n)
    };
    var isZeroTime = function() {
        return date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds() < 1
    };
    bag.push(date.getFullYear());
    bag.push("-");
    bag.push(pad(date.getMonth() + 1));
    bag.push("-");
    bag.push(pad(date.getDate()));
    if (!(skipZeroTime && isZeroTime())) {
        bag.push("T");
        bag.push(pad(date.getHours()));
        bag.push(":");
        bag.push(pad(date.getMinutes()));
        bag.push(":");
        bag.push(pad(date.getSeconds()));
        if (date.getMilliseconds()) {
            bag.push(".");
            bag.push(date.getMilliseconds())
        }
        if (!skipTimezone) {
            bag.push("Z")
        }
    }
    return bag.join("")
}

function parseISO8601(isoString) {
    var result = new Date(60 * new Date(0).getTimezoneOffset() * 1e3),
        chunks = isoString.replace("Z", "").split("T"),
        date = /(\d{4})-(\d{2})-(\d{2})/.exec(chunks[0]),
        time = /(\d{2}):(\d{2}):(\d{2})\.?(\d{0,7})?/.exec(chunks[1]);
    result.setFullYear(Number(date[1]));
    result.setMonth(Number(date[2]) - 1);
    result.setDate(Number(date[3]));
    if (Array.isArray(time) && time.length) {
        result.setHours(Number(time[1]));
        result.setMinutes(Number(time[2]));
        result.setSeconds(Number(time[3]));
        result.setMilliseconds(Number(String(time[4]).substr(0, 3)) || 0)
    }
    return result
}

function isAbsoluteUrl(url) {
    return /^(?:[a-z]+:)?\/\//i.test(url)
}

function toAbsoluteUrl(basePath, relativePath) {
    var part;
    var baseParts = stripParams(basePath).split("/");
    var relativeParts = relativePath.split("/");

    function stripParams(url) {
        var index = url.indexOf("?");
        if (index > -1) {
            return url.substr(0, index)
        }
        return url
    }
    baseParts.pop();
    while (relativeParts.length) {
        part = relativeParts.shift();
        if (".." === part) {
            baseParts.pop()
        } else {
            baseParts.push(part)
        }
    }
    return baseParts.join("/")
}
var ajaxOptionsForRequest = function(protocolVersion, request, options) {
    request = extend({
        async: true,
        method: "get",
        url: "",
        params: {},
        payload: null,
        headers: {},
        timeout: 3e4
    }, request);
    options = options || {};
    var beforeSend = options.beforeSend;
    if (beforeSend) {
        beforeSend(request)
    }
    var method = (request.method || "get").toLowerCase(),
        isGet = "get" === method,
        useJsonp = isGet && options.jsonp,
        params = extend({}, request.params),
        ajaxData = isGet ? params : formatPayload(request.payload),
        qs = !isGet && $.param(params),
        url = request.url,
        contentType = !isGet && JSON_VERBOSE_MIME_TYPE;
    if (qs) {
        url += (url.indexOf("?") > -1 ? "&" : "?") + qs
    }
    if (useJsonp) {
        ajaxData.$format = "json"
    }
    return {
        url: url,
        data: ajaxData,
        dataType: useJsonp ? "jsonp" : "json",
        jsonp: useJsonp && "$callback",
        type: method,
        async: request.async,
        timeout: request.timeout,
        headers: request.headers,
        contentType: contentType,
        accepts: {
            json: [JSON_VERBOSE_MIME_TYPE, "text/plain"].join()
        },
        xhrFields: {
            withCredentials: options.withCredentials
        }
    };

    function formatPayload(payload) {
        return JSON.stringify(payload, function(key, value) {
            if (!(this[key] instanceof Date)) {
                return value
            }
            value = formatISO8601(this[key]);
            switch (protocolVersion) {
                case 2:
                    return value.substr(0, value.length - 1);
                case 3:
                case 4:
                    return value;
                default:
                    throw errors.Error("E4002")
            }
        })
    }
};
var sendRequest = function(protocolVersion, request, options) {
    var d = $.Deferred();
    var ajaxOptions = ajaxOptionsForRequest(protocolVersion, request, options);
    $.ajax(ajaxOptions).always(function(obj, textStatus) {
        var extra, transformOptions = {
                deserializeDates: options.deserializeDates,
                fieldTypes: options.fieldTypes
            },
            tuple = interpretJsonFormat(obj, textStatus, transformOptions),
            error = tuple.error,
            data = tuple.data,
            nextUrl = tuple.nextUrl;
        if (error) {
            d.reject(error)
        } else {
            if (options.countOnly) {
                if (isFinite(tuple.count)) {
                    d.resolve(tuple.count)
                } else {
                    d.reject(new errors.Error("E4018"))
                }
            } else {
                if (nextUrl) {
                    if (!isAbsoluteUrl(nextUrl)) {
                        nextUrl = toAbsoluteUrl(ajaxOptions.url, nextUrl)
                    }
                    sendRequest(protocolVersion, {
                        url: nextUrl
                    }, options).fail(d.reject).done(function(nextData) {
                        d.resolve(data.concat(nextData))
                    })
                } else {
                    if (isFinite(tuple.count)) {
                        extra = {
                            totalCount: tuple.count
                        }
                    }
                    d.resolve(data, extra)
                }
            }
        }
    });
    return d.promise()
};
var formatDotNetError = function(errorObj) {
    var message, currentError = errorObj;
    if ("message" in errorObj) {
        if (errorObj.message.value) {
            message = errorObj.message.value
        } else {
            message = errorObj.message
        }
    }
    while (currentError = currentError.innererror || currentError.internalexception) {
        message = currentError.message;
        if (currentError.internalexception && message.indexOf("inner exception") === -1) {
            break
        }
    }
    return message
};
var errorFromResponse = function(obj, textStatus) {
    if ("nocontent" === textStatus) {
        return null
    }
    var httpStatus = 200,
        message = "Unknown error",
        response = obj;
    if ("success" !== textStatus) {
        httpStatus = obj.status;
        message = dataUtils.errorMessageFromXhr(obj, textStatus);
        try {
            response = JSON.parse(obj.responseText)
        } catch (x) {}
    }
    var errorObj = response && (response.then && response || response.error || response["odata.error"] || response["@odata.error"]);
    if (errorObj) {
        message = formatDotNetError(errorObj) || message;
        if (200 === httpStatus) {
            httpStatus = 500
        }
        if (errorObj.code) {
            httpStatus = Number(errorObj.code)
        }
        return extend(Error(message), {
            httpStatus: httpStatus,
            errorDetails: errorObj
        })
    } else {
        if (200 !== httpStatus) {
            return extend(Error(message), {
                httpStatus: httpStatus
            })
        }
    }
};
var interpretJsonFormat = function(obj, textStatus, transformOptions) {
    var value, error = errorFromResponse(obj, textStatus);
    if (error) {
        return {
            error: error
        }
    }
    if (!typeUtils.isPlainObject(obj)) {
        return {
            data: obj
        }
    }
    if ("d" in obj && (Array.isArray(obj.d) || commonUtils.isObject(obj.d))) {
        value = interpretVerboseJsonFormat(obj, textStatus)
    } else {
        value = interpretLightJsonFormat(obj, textStatus)
    }
    transformTypes(value, transformOptions);
    return value
};
var interpretVerboseJsonFormat = function(obj) {
    var data = obj.d;
    if (!isDefined(data)) {
        return {
            error: Error("Malformed or unsupported JSON response received")
        }
    }
    data = data;
    if (isDefined(data.results)) {
        data = data.results
    }
    return {
        data: data,
        nextUrl: obj.d.__next,
        count: parseInt(obj.d.__count, 10)
    }
};
var interpretLightJsonFormat = function(obj) {
    var data = obj;
    if (isDefined(data.value)) {
        data = data.value
    }
    return {
        data: data,
        nextUrl: obj["@odata.nextLink"],
        count: parseInt(obj["@odata.count"], 10)
    }
};
var EdmLiteral = Class.inherit({
    ctor: function(value) {
        this._value = value
    },
    valueOf: function() {
        return this._value
    }
});
var transformTypes = function(obj, options) {
    options = options || {};
    $.each(obj, function(key, value) {
        if (null !== value && "object" === typeof value) {
            if ("results" in value) {
                obj[key] = value.results
            }
            transformTypes(obj[key], options)
        } else {
            if ("string" === typeof value) {
                var fieldTypes = options.fieldTypes,
                    canBeGuid = !fieldTypes || "String" !== fieldTypes[key];
                if (canBeGuid && GUID_REGEX.test(value)) {
                    obj[key] = new Guid(value)
                }
                if (false !== options.deserializeDates) {
                    if (value.match(VERBOSE_DATE_REGEX)) {
                        var date = new Date(Number(RegExp.$1) + 60 * RegExp.$2 * 1e3);
                        obj[key] = new Date(date.valueOf() + 60 * date.getTimezoneOffset() * 1e3)
                    } else {
                        if (ISO8601_DATE_REGEX.test(value)) {
                            obj[key] = new Date(parseISO8601(obj[key]).valueOf())
                        }
                    }
                }
            }
        }
    })
};
var serializeDate = function(date) {
    return "datetime'" + formatISO8601(date, true, true) + "'"
};
var serializeString = function(value) {
    return "'" + value.replace(/'/g, "''") + "'"
};
var serializePropName = function(propName) {
    if (propName instanceof EdmLiteral) {
        return propName.valueOf()
    }
    return propName.replace(/\./g, "/")
};
var serializeValueV4 = function(value) {
    if (value instanceof Date) {
        return formatISO8601(value, false, false)
    }
    if (value instanceof Guid) {
        return value.valueOf()
    }
    if (Array.isArray(value)) {
        return "[" + value.map(function(item) {
            return serializeValueV4(item)
        }).join(",") + "]"
    }
    return serializeValueV2(value)
};
var serializeValueV2 = function(value) {
    if (value instanceof Date) {
        return serializeDate(value)
    }
    if (value instanceof Guid) {
        return "guid'" + value + "'"
    }
    if (value instanceof EdmLiteral) {
        return value.valueOf()
    }
    if ("string" === typeof value) {
        return serializeString(value)
    }
    return String(value)
};
var serializeValue = function(value, protocolVersion) {
    switch (protocolVersion) {
        case 2:
        case 3:
            return serializeValueV2(value);
        case 4:
            return serializeValueV4(value);
        default:
            throw errors.Error("E4002")
    }
};
var serializeKey = function(key, protocolVersion) {
    if (typeUtils.isPlainObject(key)) {
        var parts = [];
        $.each(key, function(k, v) {
            parts.push(serializePropName(k) + "=" + serializeValue(v, protocolVersion))
        });
        return parts.join()
    }
    return serializeValue(key, protocolVersion)
};
var keyConverters = {
    String: function(value) {
        return value + ""
    },
    Int32: function(value) {
        return Math.floor(value)
    },
    Int64: function(value) {
        if (value instanceof EdmLiteral) {
            return value
        }
        return new EdmLiteral(value + "L")
    },
    Guid: function(value) {
        if (value instanceof Guid) {
            return value
        }
        return new Guid(value)
    },
    Boolean: function(value) {
        return !!value
    },
    Single: function(value) {
        if (value instanceof EdmLiteral) {
            return value
        }
        return new EdmLiteral(value + "f")
    },
    Decimal: function(value) {
        if (value instanceof EdmLiteral) {
            return value
        }
        return new EdmLiteral(value + "m")
    }
};
var convertPrimitiveValue = function(type, value) {
    var converter = keyConverters[type];
    if (!converter) {
        throw errors.Error("E4014", type)
    }
    return converter(value)
};
exports.sendRequest = sendRequest;
exports.serializePropName = serializePropName;
exports.serializeValue = serializeValue;
exports.serializeKey = serializeKey;
exports.keyConverters = keyConverters;
exports.convertPrimitiveValue = convertPrimitiveValue;
exports.EdmLiteral = EdmLiteral;
