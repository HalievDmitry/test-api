requirejs.config({
    baseUrl: 'src/js',
    paths: {
        jquery: 'lib/jquery-3.3.1.min',
        test: 'component/rest',
        ko: 'lib/knockout-3.4.2'
    }
});

require([
    'jquery',
    'test',
    'ko'
], function($, test, ko) {
    'use strict';

    var customerData = ko.observable([]),
        guestCheckout = ko.observable(true),
        cart = ko.observable([]);

    var customerDataInput = $('#customerData');

    var initialData = test.initSession().then(function (data) {
        customerData(data);
    }).catch(function (err) {
        console.log(err);
    });

    customerData.subscribe(function (data) {
        if (data) {
            console.log(data);
            if (data.customer_id) {
                guestCheckout(false);
                test.getCustomerCart().then(function (data) {
                    cart(data);
                }).catch(function (err) {
                    console.log(err);
                });
            } else if(data.quote_id) {
                test.getGuestCart(data.quote_id).then(function (data) {
                    cart(data);
                }).catch(function (err) {
                    console.log(err);
                });
            }
        }
    });

    cart.subscribe(function (data) {
        console.log(data);
    });

    var frame = {
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

    $('#google-login').on('click', function (e) {
        window.open('http://magento22.org/sociallogin/social/login/authen/popup/type/google/', 'Google', frame.getPopupParams());
        // window.open('http://magento22.org/sociallogin/social/login/type/google/', 'Google', frame.getPopupParams());
    });

    $('#facebook-login').on('click', function (e) {
        window.open('http://magento22.org/sociallogin/social/login/authen/popup/type/facebook/', 'Facebook', frame.getPopupParams());
        // window.open('http://magento22.org/sociallogin/social/login/type/google/', 'Google', frame.getPopupParams());
    });


    window.socialCallback = function (url, windowObj) {
        console.log(url);
        if (url !== '') {
            window.location.href = url;
        } else {
            window.location.reload(true);
        }

        windowObj.close();
    };

    function mainPageViewModel() {
        this.asd = 'asdasd';
    }
    ko.applyBindings(new mainPageViewModel());
    // console.log();

    // $(document).ready(function () {
    //
    //     console.log(getPopupParams());
    //
    // });

    // http://magento22.org/sociallogin/social/login/authen/popup/type/google/

    // console.log(initialData);

    // console.log(test.initSession());
    // $.when(test.initSession()).then(function (data) {
    //     console.log(data);
    // });

    // console.log();
    // console.log(test.getCustomerCart());

});