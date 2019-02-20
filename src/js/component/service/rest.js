define([
    'jquery',
    'component/service/url-builder',
    'component/service/storage',
    'component/ajax/client'
], function ($, buildUrl, storage, client) {
    'use strict';

    return {
        initSession: function () {
            var url = buildUrl('rest/V1/fisha-reactcheckout/session');
            return client.get(url);
        },

        getGuestCart: function (quoteId) {
            var url = buildUrl('rest/V1/guest-carts/' + quoteId);
            return client.get(url);
        },

        getCustomerCart: function () {
            var url = buildUrl('rest/V1/carts/mine');
            return client.get(url);
        },

        signInCustomer: function () {
            var url = buildUrl('rest/V1/fisha-reactcheckout/authenticate'),
                data = {
                    "email": "dima.k@fisha.co.il",
                    "password": "!dimatest$"
                };
            return client.post(url, data);
        },

        getTotals: function (cartId) {
            var url = cartId ? buildUrl('rest/default/V1/guest-carts/'+ cartId +'/totals') :
                buildUrl('rest/V1/carts/mine/totals');

            return client.get(url);
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
            return client.post(url, data);
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

            return client.post(url, data);
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
            return client.post(url, data);
        },

        setGuestShipping: function (cartId) {
            var url = buildUrl('rest/default/V1/guest-carts/' + cartId + '/shipping-information'),
                data = {
                    "addressInformation":{
                        "shipping_address":{
                            "countryId":"GB",
                            "region":"",
                            "street":[
                                "Street2"
                            ],
                            "company":"",
                            "telephone":"123123123123",
                            "postcode":"123123",
                            "city":"City 1",
                            "firstname":"Dmitry",
                            "lastname":"Khaliev"
                        },
                        "billing_address":{
                            "countryId":"GB",
                            "region":"",
                            "street":[
                                "Street2"
                            ],
                            "company":"",
                            "telephone":"123123123123",
                            "postcode":"123123",
                            "city":"City 1",
                            "firstname":"Dmitry",
                            "lastname":"Khaliev",
                            "saveInAddressBook":null
                        },
                        "shipping_method_code":"flatrate",
                        "shipping_carrier_code":"flatrate"
                    }
                };

            return client.post(url, data);
        },

        setCustomerShipping: function () {
            var url = buildUrl('rest/default/V1/carts/mine/shipping-information'),
                data = {
                    "addressInformation":{
                        "shipping_address":{
                            "countryId":"GB",
                            "region":"",
                            "street":[
                                "Street2"
                            ],
                            "company":"",
                            "telephone":"123123123123",
                            "postcode":"123123",
                            "city":"City 1",
                            "firstname":"Dmitry",
                            "lastname":"Khaliev"
                        },
                        "billing_address":{
                            "countryId":"GB",
                            "region":"",
                            "street":[
                                "Street2"
                            ],
                            "company":"",
                            "telephone":"123123123123",
                            "postcode":"123123",
                            "city":"City 1",
                            "firstname":"Dmitry",
                            "lastname":"Khaliev",
                            "saveInAddressBook":null
                        },
                        "shipping_method_code":"flatrate",
                        "shipping_carrier_code":"flatrate"
                    }
                };

            return client.post(url, data);
        },

        placePaypal: function (cartId) {
            var url = cartId ? buildUrl('rest/default/V1/guest-carts/' + cartId + '/set-payment-information') :
                buildUrl('rest/default/V1/carts/mine/set-payment-information'),
                data = {
                    "cartId":cartId,
                    "email":"dima.k@fisha.co.il",
                    "paymentMethod":{
                        "method":"paypal_express",
                        "extension_attributes": {
                            "agreement_ids": [
                                "1"
                            ]
                        }
                    },
                    "billingAddress":{
                        "countryId":"GB",
                        "region":"",
                        "street":[
                            "Street2"
                        ],
                        "company":"",
                        "telephone":"123123123123",
                        "postcode":"123123",
                        "city":"City 1",
                        "firstname":"Dmitry",
                        "lastname":"Khaliev",
                        "saveInAddressBook":null
                    }
                };

            return client.post(url, data);
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
                        "countryId":"GB",
                        "region":"",
                        "street":[
                            "Street2"
                        ],
                        "company":"",
                        "telephone":"123123123123",
                        "postcode":"123123",
                        "city":"City 1",
                        "firstname":"Dmitry",
                        "lastname":"Khaliev",
                        "saveInAddressBook":null
                    }
                };

            return client.post(url, data);
        },

        applyCoupon: function (cartId) {
            var url = cartId ? buildUrl('rest/default/V1/guest-carts/'+cartId+'/coupons/'+ storage.couponCode()) :
                buildUrl('rest/default/V1/carts/mine/coupons/' + storage.couponCode());

            return client.put(url);
        },

        deleteCoupon: function (cartId) {
            var url = cartId ? buildUrl('rest/default/V1/guest-carts/'+cartId+'/coupons') :
                buildUrl('rest/default/V1/carts/mine/coupons');

            return client.delete(url);
        },

        getPaymentInfo: function (cartId) {
            var url = cartId ? buildUrl('rest/default/V1/guest-carts/'+cartId+'/payment-information') :
                buildUrl('rest/default/V1/carts/mine/payment-information');
            return client.get(url);
        }

    };
});
