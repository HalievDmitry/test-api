require([
    'ko'
], function(ko) {
    'use strict';

    ko.components.register('main-app', { require: 'component/main/app' });
    ko.components.register('safecharge-form', { require: 'component/safecharge/form' });
    ko.components.register('coupon-form', { require: 'component/coupon/form' });

    ko.applyBindings(function () {});
});