define([
    'ko',
    'text!./form.html',
    'component/service/storage',
    'component/utils',
    'component/credit-card/validator',
    'rest',
    'component/service/url-builder'
], function(ko, template, storage, utils, cardValidator, rest, buildUrl) {

    return {
        viewModel: function (params) {

            this.creditCard = storage.creditCard;
            this.customerData = storage.customerData;

            this.placeSafecharge = function (form) {
                var data = utils.formData(form),
                    result = cardValidator(data.cc_number),
                    quoteId;

                if (result.isValid && result.card.type) {
                    data.cc_type = result.card.type;
                    this.creditCard($.extend(this.creditCard(), data));
                } else {
                    console.error(result);
                    return;
                }

                if (!this.customerData().customer_id) {
                    quoteId = this.customerData().quote_id;
                }
                rest.placeSafecharge(quoteId).then(function (data) {
                    window.location.href = buildUrl('checkout/onepage/success/');
                }).catch(function (err) {
                    console.error(err);
                });
            };

        },
        template: template
    };
});
