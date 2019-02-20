define([
    'ko',
    'text!./form.html',
    'component/service/storage',
    'rest'
], function(ko, template, storage, rest) {

    return {
        viewModel: function (params) {
            this.customerData = storage.customerData;
            this.couponCode = storage.couponCode;

            this.applyCoupon = function () {
                var quoteId;
                if (!this.customerData().customer_id) {
                    quoteId = this.customerData().quote_id;
                }
                rest.applyCoupon(quoteId).then(function (data) {
                    params.parent.updateTotals();
                    console.log(data);
                }).catch(function (err) {
                    console.error(err);
                });
            };

            this.deleteCoupon = function () {
                var quoteId;
                if (!this.customerData().customer_id) {
                    quoteId = this.customerData().quote_id;
                }
                rest.deleteCoupon(quoteId).then(function (data) {
                    params.parent.updateTotals();
                    console.log(data);
                }).catch(function (err) {
                    console.error(err);
                });
            };

        },
        template: template
    };
});
