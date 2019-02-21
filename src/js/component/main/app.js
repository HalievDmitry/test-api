define([
    'jquery',
    'rest',
    'ko',
    'text!./app.html',
    'component/service/url-builder',
    'component/utils',
    'component/service/storage',
    'component/service/totals'
], function($, rest, ko, template, buildUrl, utils, storage, totals) {

    return {
        viewModel: function (params) {
            this.customerData = storage.customerData;
            this.guestCheckout = ko.observable(true);
            this.cart = storage.cart;
            this.cardType = ko.observable('');
            this.totals = totals.getTotals();

            var self = this;

            this.initSession = function () {
                if (!this.customerData() || !storage.quoteId()) {
                    rest.initSession().then(function (data) {
                        self.customerData(data);
                    }).catch(function (err) {
                        console.error(err);
                    });
                } else {
                    self.initData(this.customerData());
                }
            };

            this.initData = function(data) {
                if (data) {
                    if (data.customer_id) {
                        self.guestCheckout(false);
                        if (_.isEmpty(self.cart())) {
                            rest.getCustomerCart().then(function (data) {
                                console.log(data);
                                self.cart(data);
                                totals.collect();
                            }).catch(function (err) {
                                console.error(err);
                            });
                        }
                    } else if (data.quote_id) {
                        if (!self.cart()) {
                            var quoteId = data.quote_id;
                            rest.getGuestCart(quoteId).then(function (data) {
                                console.log(data);
                                totals.collect();
                                self.cart(data);
                            }).catch(function (err) {
                                console.error(err);
                            });
                        }
                    }
                }
            };

            this.initSession();

            this.customerData.subscribe(function (data) {
                self.initData(data);
            });

            this.getGuestShippings = function () {
                rest.getGuestShippingMethods(this.customerData().quote_id).then(function (data) {
                    console.log(data);
                }).catch(function (err) {
                    console.error(err);
                });
            };

            this.getCustomerShippings = function () {
                rest.getCustomerShippingMethods().then(function (data) {
                    console.log(data);
                }).catch(function (err) {
                    console.error(err);
                });
            };

            this.setGuestShipping = function () {
                rest.setGuestShipping(this.customerData().quote_id).then(function (data) {
                    console.log(data);
                }).catch(function (err) {
                    console.error(err);
                });
            };

            this.setCustomerShipping = function () {
                rest.setCustomerShipping().then(function (data) {
                    console.log(data);
                }).catch(function (err) {
                    console.error(err);
                });
            };

            this.getPaymentInfo = function () {
                rest.getPaymentInfo().then(function (data) {
                    console.log(data);
                }).catch(function (err) {
                    console.error(err);
                });
            };
        },
        template: template
    };
});
