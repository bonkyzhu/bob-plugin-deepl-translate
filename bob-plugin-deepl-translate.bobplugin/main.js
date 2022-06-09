'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var api = require('./api.js');
var config = require('./config.js');
var utils = require('./utils.js');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function supportLanguages() {
    return config.supportedLanguages.map(([standardLang]) => standardLang);
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function translate(query, completion) {
    const api$1 = new api.Api($option.api, $option.token);
    (async () => {
        var _a;
        const targetLanguage = utils.langMap.get(query.detectTo);
        $log.info(`translate to ${targetLanguage}`);
        if (!targetLanguage) {
            const err = new Error();
            Object.assign(err, {
                _type: 'unsupportLanguage',
                _message: '不支持该语种',
            });
            throw err;
        }
        const formality = isFormalitySupported(targetLanguage)
            ? $option.formality
            : 'default';
        const response = await api$1.request({
            method: 'POST',
            url: '/v2/translate',
            body: {
                text: query.text,
                target_lang: targetLanguage,
                split_sentences: '1',
                preserve_formatting: '0',
                formality,
            },
        });
        if (response.error) {
            const { statusCode } = response.response;
            let reason;
            if (statusCode >= 400 && statusCode < 500) {
                reason = 'param';
            }
            else {
                reason = 'api';
            }
            completion({
                error: {
                    type: reason,
                    message: `接口响应错误 ${utils.translateStatusCode(statusCode)}`,
                    addtion: JSON.stringify(response),
                },
            });
        }
        else {
            const translations = (_a = response.data) === null || _a === void 0 ? void 0 : _a.translations;
            if (!translations || !translations.length) {
                completion({
                    error: {
                        type: 'api',
                        message: '接口未返回翻译结果',
                    },
                });
                return;
            }
            completion({
                result: {
                    from: utils.langMapReverse.get(translations[0].detected_source_language),
                    toParagraphs: translations.map((item) => insert_spacing(item.text.replace(/。/g, "\n"))),
                },
            });
        }
    })().catch((err) => {
        completion({
            error: {
                type: err._type || 'unknown',
                message: err._message || '未知错误',
                addtion: err._addtion,
            },
        });
    });
}
function isFormalitySupported(lang) {
    const unsupported = ['EN', 'EN-GB', 'EN-US', 'ES', 'JA', 'ZH'];
    return !unsupported.includes(lang.toUpperCase());
}
function insert_spacing(str) {
    var p1=/([A-Za-z_])([\u4e00-\u9fa5]+)/gi;
    var p2=/([\u4e00-\u9fa5]+)([A-Za-z_])/gi;
    return str.replace(p1, "$1 $2").replace(p2, "$1 $2")
}

exports.supportLanguages = supportLanguages;
exports.translate = translate;
