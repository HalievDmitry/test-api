define([
    'jquery'
], function ($) {
    'use strict';

    return {
        
        get: function (url) {
            return this._makeRequest('get', url);
        },
        
        post: function (url, data) {
            return this._makeRequest('post', url, data);
        },
        
        put: function (url, data) {
            return this._makeRequest('put', url, data);
        },

        delete: function (url, data) {
            return this._makeRequest('delete', url, data);
        },
        
        _makeRequest: function (method, url, data) {
            return new Promise(function (resolve, reject) {
                var options = {
                    method: method,
                    url: url
                };

                if (data) {
                    $.extend(options, {
                        data: JSON.stringify(data),
                        contentType: 'application/json'
                    });
                }

                $.ajax(options).done(function (data) {
                    resolve(data);
                }).fail(function (err) {
                    reject(err)
                });
            });
        }
    }

});
