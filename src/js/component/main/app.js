define([
    'jquery',
    'rest',
    'ko',
    'text!./app.html',
    'component/service/url-builder',
    'component/utils',
    'component/service/storage',
    'component/totals',
    'paypalInContext'
], function($, rest, ko, template, buildUrl, utils, storage, totals, paypalExpressCheckout) {

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

                    self._setupPaypal();
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

            /**
             * Magento's solution. Based on button linking.
             * @type {{environment: string, locale: string, button: [string], click: exports.clientConfig.click}}
             */
            /*
            this.clientConfig = {
                "environment": "sandbox",
                "locale": "en_US",
                "button": ["paypal-place-btn"],
                click: function (event) {
                    event.preventDefault();
                    var quoteId;
                    if (!self.customerData().customer_id) {
                        quoteId = self.customerData().quote_id;
                    }
                    paypalExpressCheckout.checkout.initXO();
                    var url = buildUrl('paypal/express/gettoken/');
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
                                paypalExpressCheckout.checkout.closeFlow();
                            }).fail(function () {
                                paypalExpressCheckout.checkout.closeFlow();
                            }).always(function () {
                                // console.log('errrroooooorrr');
                            });
                        }
                    }).catch(function (err) {
                        console.error(err);
                        paypalExpressCheckout.checkout.closeFlow();
                    });
                }
            };

            initClient = function () {
                var selector = '#paypal-place-btn',
                    clientInit;

                $.each(self.clientConfig, function (name, fn) {
                    if (typeof fn === 'function') {
                        self.clientConfig[name] = fn.bind(self);
                    }
                });
                console.log(self.clientConfig);

                if (!clientInit) {
                    paypalExpressCheckout.checkout.setup('A6VD24NDVY9XJ', self.clientConfig);
                    console.log(self.clientConfig);
                    clientInit = true;
                } else {
                    $(selector).on('click', self.clientConfig.click);
                }

                return this;
            };
            initClient();
            */
            /**
             * END of Magento's solution
             */

            this._setupPaypal = function () {
                paypalExpressCheckout.checkout.setup(self.customerData().paypal_config.merchant_id, {
                    "environment": self.customerData().paypal_config.environment,
                    "locale": self.customerData().paypal_config.locale
                });
            }

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
                paypalExpressCheckout.checkout.initXO();

                var url = self.customerData().paypal_config.path;
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
