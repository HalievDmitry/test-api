define([
    'jquery'
], function () {
    'use strict';

    return {

        formData: function (form) {
            var formData = {},
                formDataArray = $(form).serializeArray();

            $.map(formDataArray, function (a) {
                formData[a.name] = a.value;
            });
            return formData;
        }

    };

});
