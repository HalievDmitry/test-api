define([
    'jquery',
    'component/url-builder',
    'component/storage'
], function ($, buildUrl, storage) {
    'use strict';

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

        getGuestCartTotals: function (quoteId) {
            var url = buildUrl('rest/default/V1/guest-carts/'+ quoteId +'/totals');

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
        },

        getGuestShippingMethods: function (quoteId) {
            var url = buildUrl('rest/default/V1/guest-carts/'+ quoteId +'/estimate-shipping-methods'),
                data = {
                    "address":
                        {
                            "region_id":null,
                            "country_id":"US",
                            "postcode":null
                        }
                };

            return post(url, data);
        },

        getCustomerShippingMethods: function () {
            var url = buildUrl('rest/default/V1/carts/mine/estimate-shipping-methods'),
                data = {
                    "address":
                        {
                            "region_id":null,
                            "country_id":"US",
                            "postcode":null
                        }
                };
            return post(url, data);
        },

        setGuestShipping: function (cartId) {
            var url = buildUrl('rest/default/V1/guest-carts/' + cartId + '/shipping-information'),
                data = {
                    "addressInformation":{
                        "shipping_address":{
                            "countryId":"SY",
                            "region":"",
                            "street":[
                                "asdasdasd"
                            ],
                            "company":"",
                            "telephone":"123123123123",
                            "postcode":"123123",
                            "city":"asdasdasd",
                            "firstname":"Dmitry",
                            "lastname":"Khaliev"
                        },
                        "billing_address":{
                            "countryId":"SY",
                            "region":"",
                            "street":[
                                "asdasdasd"
                            ],
                            "company":"",
                            "telephone":"123123123123",
                            "postcode":"123123",
                            "city":"asdasdasd",
                            "firstname":"Dmitry",
                            "lastname":"Khaliev",
                            "saveInAddressBook":null
                        },
                        "shipping_method_code":"flatrate",
                        "shipping_carrier_code":"flatrate"
                    }
                };

            return post(url, data);
        },

        setCustomerShipping: function () {
            var url = buildUrl('rest/default/V1/carts/mine/shipping-information'),
                data = {
                    "addressInformation":{
                        "shipping_address":{
                            "countryId":"SY",
                            "region":"",
                            "street":[
                                "asdasdasd"
                            ],
                            "company":"",
                            "telephone":"123123123123",
                            "postcode":"123123",
                            "city":"asdasdasd",
                            "firstname":"Dmitry",
                            "lastname":"Khaliev"
                        },
                        "billing_address":{
                            "countryId":"SY",
                            "region":"",
                            "street":[
                                "asdasdasd"
                            ],
                            "company":"",
                            "telephone":"123123123123",
                            "postcode":"123123",
                            "city":"asdasdasd",
                            "firstname":"Dmitry",
                            "lastname":"Khaliev",
                            "saveInAddressBook":null
                        },
                        "shipping_method_code":"flatrate",
                        "shipping_carrier_code":"flatrate"
                    }
                };

            return post(url, data);
        },

        placePaypal: function (cartId) {
            var url = cartId ? buildUrl('rest/default/V1/guest-carts/' + cartId + '/set-payment-information') :
                buildUrl('rest/default/V1/carts/mine/set-payment-information'),
                data = {
                    "cartId":cartId,
                    "email":"dima.k@fisha.co.il",
                    "paymentMethod":{
                        "method":"paypal_express"
                    },
                    "billingAddress":{
                        "countryId":"SY",
                        "region":"",
                        "street":[
                            "asdasdasd"
                        ],
                        "company":"",
                        "telephone":"123123123123",
                        "postcode":"123123",
                        "city":"asdasdasd",
                        "firstname":"Dmitry",
                        "lastname":"Khaliev",
                        "saveInAddressBook":null
                    }
                };

            return post(url, data);
        },

        placeSafecharge: function (cartId) {
            var url = cartId ? buildUrl('rest/default/V1/guest-carts/' + cartId + '/payment-information') :
                buildUrl('rest/default/V1/carts/mine/payment-information'),
                data = {
                    "cartId":cartId,
                    "email":"dima.k@fisha.co.il",
                    "paymentMethod":{
                        "method":"safecharge",
                        "additional_data":storage.creditCard()
                    },
                    "billingAddress":{
                        "countryId":"SY",
                        "region":"",
                        "street":[
                            "asdasdasd"
                        ],
                        "company":"",
                        "telephone":"123123123123",
                        "postcode":"123123",
                        "city":"asdasdasd",
                        "firstname":"Dmitry",
                        "lastname":"Khaliev",
                        "saveInAddressBook":null
                    }
                };

            return post(url, data);
        }

    };
});
