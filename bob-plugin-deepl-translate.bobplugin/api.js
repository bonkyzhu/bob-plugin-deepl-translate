'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class Api {
    constructor(provider, token) {
        this.provider = provider;
        this.token = token;
    }
    get baseUrl() {
        switch (this.provider) {
            case 'deepl-pro':
                return 'https://api.deepl.com';
            default:
                return 'https://api-free.deepl.com';
        }
    }
    async request(requestObject) {
        try {
            const body = Object.assign(Object.assign({}, requestObject.body), { auth_key: this.token });
            const url = `${this.baseUrl}${requestObject.url}`;
            return await $http.request(Object.assign(Object.assign({}, requestObject), { url, header: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'a-translator-bob/' + "0.8.0",
                }, body }));
        }
        catch (e) {
            Object.assign(e, {
                _type: 'network',
                _message: '接口请求错误 ' + e.message,
            });
            throw e;
        }
    }
}

exports.Api = Api;
