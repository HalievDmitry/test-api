define([
    'jquery',
    'rest',
    'ko',
    'text!./app.html',
    'component/service/url-builder',
    'component/utils',
    'component/service/storage',
    'component/totals'
], function($, rest, ko, template, buildUrl, utils, storage, totals) {

    return {
        viewModel: function (params) {
            this.customerData = storage.customerData;
            this.guestCheckout = ko.observable(true);
            this.cart = ko.observable([]);
            this.creditCard = storage.creditCard;
            this.cardType = ko.observable('');
            this.totals = totals;

            var self = this;

            var initSession = function () {
                rest.initSession().then(function (data) {
                    self.customerData(data);
                }).catch(function (err) {
                    console.error(err);
                });
            };

            initSession();

            this.customerData.subscribe(function (data) {
                if (data) {
                    console.log(data);
                    if (data.customer_id) {
                        self.guestCheckout(false);
                        rest.getCustomerCart().then(function (data) {
                            console.log(data);
                            self.cart(data);
                            self.updateTotals();
                        }).catch(function (err) {
                            console.error(err);
                        });
                    } else if(data.quote_id) {
                        var quoteId = data.quote_id;
                        rest.getGuestCart(quoteId).then(function (data) {
                            console.log(data);
                            self.updateTotals();
                            self.cart(data);
                        }).catch(function (err) {
                            console.error(err);
                        });
                    }
                }
            });

            this.updateTotals = function () {
                var quoteId;
                if (!this.customerData().customer_id) {
                    quoteId = this.customerData().quote_id;
                }
                rest.getTotals(quoteId).then(function (data) {
                    totals(data);
                    console.log(totals());
                }).catch(function (err) {
                    console.error(err);
                });
            };

            this.frame = {
                getPopupParams: function (w, h, l, t) {
                    this.screenX = typeof window.screenX !== 'undefined' ? window.screenX : window.screenLeft;
                    this.screenY = typeof window.screenY !== 'undefined' ? window.screenY : window.screenTop;
                    this.outerWidth = typeof window.outerWidth !== 'undefined' ? window.outerWidth : document.body.clientWidth;
                    this.outerHeight = typeof window.outerHeight !== 'undefined' ? window.outerHeight : (document.body.clientHeight - 22);
                    this.width = w ? w : 500;
                    this.height = h ? h : 420;
                    this.left = l ? l : parseInt(this.screenX + ((this.outerWidth - this.width) / 2), 10);
                    this.top = t ? t : parseInt(this.screenY + ((this.outerHeight - this.height) / 2.5), 10);
                    return (
                        'width=' + this.width +
                        ',height=' + this.height +
                        ',left=' + this.left +
                        ',top=' + this.top
                    );
                }
            };

            window.socialCallback = function (url, windowObj) {
                console.log(url);
                // if (url !== '') {
                //     window.location.href = url;
                // } else {
                //     window.location.reload(true);
                // }

                initSession();
                windowObj.close();
            };

            this.loginGoogle = function () {
                this.customerData().social_config.forEach(function (config) {
                    if (config.label == 'Google') {
                        window.open(config.link, config.label, self.frame.getPopupParams());
                    }
                });
            };

            this.loginFacebook = function () {
                this.customerData().social_config.forEach(function (config) {
                    if (config.label == 'Facebook') {
                        window.open(config.link, config.label, self.frame.getPopupParams());
                    }
                });
            };

            this.signIn = function () {
                rest.signInCustomer().then(function (data) {
                    initSession();
                }).catch(function (err) {
                    console.error(err);
                });
            };

            this.createAccount = function () {
                rest.createCustomer().then(function (data) {
                    console.log(data);
                }).catch(function (err) {
                    console.error(err);
                });
            };

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

            this.placePaypal = function () {
                var quoteId;
                if (!this.customerData().customer_id) {
                    quoteId = this.customerData().quote_id;
                }
                rest.placePaypal(quoteId).then(function (data) {
                    if (data === true) {
                        console.log(data);
                        window.location.href = buildUrl('paypal/express/start/');
                    }
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