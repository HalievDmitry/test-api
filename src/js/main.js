require([
    'jquery',
    'rest',
    'ko'
], function($, rest, ko) {
    'use strict';

    function mainPageViewModel() {
        this.customerData = ko.observable([]);
        this.guestCheckout = ko.observable(true);
        this.cart = ko.observable([]);

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
                    }).catch(function (err) {
                        console.error(err);
                    });
                } else if(data.quote_id) {
                    rest.getGuestCart(data.quote_id).then(function (data) {
                        console.log(data);
                        self.cart(data);
                    }).catch(function (err) {
                        console.error(err);
                    });
                }
            }
        });

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
            window.open('http://magento22.org/sociallogin/social/login/authen/popup/type/google/', 'Google', self.frame.getPopupParams());
        };

        this.loginFacebook = function () {
            window.open('http://magento22.org/sociallogin/social/login/authen/popup/type/facebook/', 'Facebook', self.frame.getPopupParams());
        };

        this.signIn = function () {
            rest.signInCustomer().then(function (data) {
                initSession();
            }).catch(function (err) {
                console.error(err);
            });
        };

    }
    ko.applyBindings(new mainPageViewModel());
});