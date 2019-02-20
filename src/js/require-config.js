requirejs.config({
    baseUrl: 'src/js',
    paths: {
        jquery: 'lib/jquery-3.3.1.min',
        rest: 'component/service/rest',
        ko: 'lib/knockout-3.4.2',
        paypalInContext: 'https://www.paypalobjects.com/api/checkout',
        text: 'lib/text'
    },
    shim: {
        paypalInContext: {
            exports: 'paypal'
        }
    }
});
