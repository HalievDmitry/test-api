define([
    'rest',
    'text!./login.html',
    'component/service/storage'
], function (rest, template, storage) {
    'use strict';
    
    return {
        viewModel: function (params) {
            this.loginGoogle = function () {
                storage.customerData().social_config.forEach(function (config) {
                    if (config.label == 'Google') {
                        window.open(config.link, config.label, this.frame.getPopupParams());
                    }
                }.bind(this));
            };

            this.loginFacebook = function () {
                storage.customerData().social_config.forEach(function (config) {
                    if (config.label == 'Facebook') {
                        console.log(config.link);
                        window.open(config.link, config.label, this.frame.getPopupParams());
                    }
                }.bind(this));
            };
            
            this.signIn = function () {
                rest.signInCustomer().then(function (data) {
                    params.parent.initSession();
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
                // console.log(url);
                // console.log(windowObj);
                // console.log(params.parent.initSession());
                // if (url !== '') {
                //     window.location.href = url;
                // } else {
                //     window.location.reload(true);
                // }
                windowObj.close();
                params.parent.initSession();
            };
        },
        template: template
    }
    
});
