define([
    'rest',
    'text!./button.html',
    'component/service/storage',
    'paypalInContext'
], function (rest, template, storage, paypalExpressCheckout) {
    'use strict';

    return {
        viewModel: function () {

            storage.customerData.subscribe(function (data) {
                if (data) {
                    this._setupPaypal();
                }
            }.bind(this));

            this._setupPaypal = function () {
                paypalExpressCheckout.checkout.setup(storage.customerData().paypal_config.merchant_id, {
                    "environment": storage.customerData().paypal_config.environment,
                    "locale": storage.customerData().paypal_config.locale
                });
            };

            this.placePaypal = function () {
                var quoteId;
                if (!storage.customerData().customer_id) {
                    quoteId = storage.customerData().quote_id;
                }
                paypalExpressCheckout.checkout.initXO();

                var url = storage.customerData().paypal_config.path;
                rest.placePaypal(quoteId).then(function (data) {
                    if (data === true) {
                        $.getJSON(url, {
                            button: 0
                        }).done(function (response) {
                            var message = response && response.message;

                            if (message) {
                                if (message.type === 'error') {
                                    console.log(message);
                                } else {
                                    console.log(message);
                                }
                            }
                            console.log(response);
                            if (response && response.url) {
                                paypalExpressCheckout.checkout.startFlow(response.url);
                                return;
                            }
                        }).fail(function () {
                            paypalExpressCheckout.checkout.closeFlow();
                        }).always(function () {
                            console.log('seems it\'s working');
                        });
                    }
                }).catch(function (err) {
                    console.error(err);
                    paypalExpressCheckout.checkout.closeFlow();
                });
            }
        },
        template: template
    }

});
