define([
    'ko'
], function (ko) {
    'use strict';

    return {
        creditCard: ko.observable({
            cc_number: '5333339469130529',
            cc_exp_month: '3',
            cc_exp_year: '2022',
            cc_owner: 'Dmitry Test',
            cc_cid: '332',
            cc_type: null,
            cc_save: false
        }),

        couponCode: ko.observable(''),

        customerData: ko.observable({})
    }

});
