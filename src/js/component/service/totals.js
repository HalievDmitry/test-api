define([
    'ko',
    'rest',
    'component/service/storage'
], function (ko, rest, storage) {
    'use strict';

    var totals = ko.observable({});

    return {

        getTotals: function () {
            return totals;
        },

        collect: function () {
            var quoteId = storage.customerIsGuest() && storage.quoteId();

            rest.getTotals(quoteId).then(function (data) {
                totals(data);
            }).catch(function (err) {
                console.error(err);
            });

        }

    };

});
