define([
    'jquery'
], function ($) {
    'use strict';

    var base_url = 'https://magento22.org/';
    var buildUrl = function (path) {
        return base_url + path;
    };
    var get = function (url) {
        return new Promise(function (resolve, reject) {
            $.get(url).done(function (data) {
                resolve(data);
            }).fail(function (err) {
                reject(err)
            });
        });
    };

    var post = function (url, data) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                method: 'post',
                url: url,
                data: JSON.stringify(data),
                contentType: 'application/json'
            }).done(function (data) {
                resolve(data);
            }).fail(function (err) {
                reject(err)
            });
        });
    }


    return {
        initSession: function () {
            var url = buildUrl('rest/V1/fisha-reactcheckout/session');
            return get(url);
        },

        getGuestCart: function (quoteId) {
            var url = buildUrl('rest/V1/guest-carts/' + quoteId);
            return get(url);
        },

        getCustomerCart: function () {
            var url = buildUrl('rest/V1/carts/mine');
            return get(url);
        },

        signInCustomer: function () {
            var url = buildUrl('rest/V1/fisha-reactcheckout/authenticate'),
                data = {
                    "email": "dima.k@fisha.co.il",
                    "password": "!dimatest$"
                };
            return post(url, data);
        },

        getCustomerCartTotals: function () {
            var url = buildUrl('rest/V1/carts/mine/totals');
            return get(url);
        },

        createCustomer: function () {
            var url = buildUrl('rest/V1/customers'),
                data = {
                    "customer": {
                        "email": "dima.k+3@fisha.co.il",
                        "firstname": "dmitry",
                        "lastname": "test",
                        "extension_attributes": {
                            "is_subscribed": true
                        }
                    },
                    "password": "!dimatest$"
                };
            return post(url, data);
        }

    };
});
