define([
    'ko'
], function (ko) {
    'use strict';

    var creditCard = ko.observable({
            cc_number: '5333339469130529',
            cc_exp_month: '3',
            cc_exp_year: '2022',
            cc_owner: 'Dmitry Test',
            cc_cid: '332',
            cc_type: null,
            cc_save: false
        }),
        couponCode = ko.observable(''),
        customerData = ko.observable({});

    return {
        creditCard: creditCard,

        couponCode: couponCode,

        customerData: customerData,

        customerIsGuest: ko.computed(function () {
            return (!(customerData() && customerData().customer_id));
        }, this),

        quoteId: ko.computed(function () {
            return customerData() && customerData().quote_id;
        })
    }

});
