/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const url = require('url');
const isObject = require('lodash/isObject');
const {addLocaleData} = require('react-intl');

const en = require('react-intl/locale-data/en');
const ky = require('react-intl/locale-data/ky');
const ru = require('react-intl/locale-data/ru');

addLocaleData([...en,  ...ky, ...ru]);

/*
 * it, en, fr, de, es are the default locales and it is preferrable to customize them via configuration.
 * if you want to change it please read documentation guide on how to do this.
*/
let supportedLocales = {
    "en": {
        code: "en-US",
        description: "English"
    },
    "ky": {
        code: "ky-KG",
        description: "Кыргызча"
    },
    "ru": {
        code: "ru-RU",
        description: "Русский"
    }
};
export const DATE_FORMATS = {
    "default": "YYYY/MM/DD",
    "en-US": "MM/DD/YYYY",
    "ky-KG": "DD/MM/YYYY",
    "ru-RU": "MM/DD/YYYY"
};

let errorParser = {};

/**
 * Utilities for locales.
 * @memberof utils
 */
let LocaleUtils;
export const ensureIntl = (callback) => {
    require.ensure(['intl', 'intl/locale-data/jsonp/en.js', 'intl/locale-data/jsonp/ky.js', 'intl/locale-data/jsonp/ru.js'], (require) => {
        global.Intl = require('intl');
        require('intl/locale-data/jsonp/en.js');
        require('intl/locale-data/jsonp/ky.js');
        require('intl/locale-data/jsonp/ru.js');
        if (callback) {
            callback();
        }
    });
};
export const setSupportedLocales = function(locales) {
    supportedLocales = locales;
};
export const normalizeLocaleCode = function(localeCode) {
    var retval;
    if (localeCode === undefined || localeCode === null) {
        retval = undefined;
    } else {
        let rg = /^[a-z]+/i;
        let match = rg.exec(localeCode);
        if (match && match.length > 0) {
            retval = match[0].toLowerCase();
        } else {
            retval = undefined;
        }
    }
    return retval;
};
export const getUserLocale = function() {
    return LocaleUtils.getLocale(url.parse(window.location.href, true).query);
};
export const getLocale = function(query = {}) {
    const key = Object.keys(supportedLocales)[0];
    const defaultLocale = supportedLocales.ru ? { key: 'ru', locale: supportedLocales.ru } : { key, locale: supportedLocales[key] };
    let locale = supportedLocales[
        LocaleUtils.normalizeLocaleCode(query.locale || (navigator ? navigator.language || navigator.browserLanguage : defaultLocale.key))
    ];
    return locale ? locale.code : defaultLocale.locale.code;
};
export const getSupportedLocales = function() {
    return supportedLocales;
};
export const getDateFormat = (locale) => {
    return DATE_FORMATS[locale] || DATE_FORMATS.default;
};
export const getMessageById = function(messages, msgId) {
    var message = messages;
    msgId.split('.').forEach(part => {
        message = message ? message[part] : null;
    });
    return message || msgId;
};
/**
 * Register a parser to translate error services
 * @param type {string} name of the service
 * @param parser {object} custom parser of the service
 */
export const registerErrorParser = (type, parser) => {
    errorParser[type] = parser;
};
/**
 * Return localized id of error messages
 * @param e {object} error
 * @param service {string} service that thrown the error
 * @param section {string} section where the error happens
 * @return {object} {title, message}
 */
export const getErrorMessage = (e, service, section) => {
    return service && section && errorParser[service] && errorParser[service][section] && errorParser[service][section](e) || {
        title: 'errorTitleDefault',
        message: 'errorDefault'
    };
};
/**
 * Retrieve localized string from object of translations
 * @param {string} locale code of locale, eg. en-US
 * @param {string|object} prop source of translation
 * @returns {string} localized string
 */
export const getLocalizedProp = (locale, prop) => isObject(prop) ? prop[locale] || prop.default : prop || '';

LocaleUtils = {
    getLocale,
    normalizeLocaleCode
};
