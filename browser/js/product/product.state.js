'use strict';

app.config(function ($stateProvider) {
    $stateProvider.state('product', {
        url: '/products/:id',
        templateUrl: 'js/product/product.html',
        controller: 'ProductCtrl',
        resolve: {
          product: function(ProductFactory, $stateParams) {
            return ProductFactory.getProduct($stateParams.id);
          }
        }
    });
});
