'use strict';

app.config(function ($stateProvider) {
    $stateProvider.state('addProduct', {
        url: '/products/add',
        templateUrl: 'js/admin/add-product.html',
        controller: 'AdminCtrl',
        resolve: {
          categories: function(Products) {
            return Products.getAllCategories();
          }
        }
    });

    $stateProvider.state('adminHome.addCategory', {
        templateUrl: 'js/admin/add-category.html',
        controller: 'AdminCtrl',
    });
});
