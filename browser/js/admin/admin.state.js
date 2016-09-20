'use strict';

app.config(function ($stateProvider) {
    $stateProvider.state('adminHome', {
        url: '/admin/home',
        templateUrl: 'js/admin/admin-home.html',
        controller: 'AdminCtrl',
        resolve: {
          categories: function(Products) {
            return Products.getAllCategories();
          },
          products: function(Products) {
            return Products.fetchAll()
            .then(function(res){
                console.log(res);
            })
          }
      }
    });

    $stateProvider.state('addProduct', {
        url: '/products/add',
        templateUrl: 'js/admin/add-product.html',
        controller: 'AdminCtrl',
        resolve: {
        }
    });

    $stateProvider.state('adminHome.productList', {
        templateUrl: 'js/admin/product-list.html',
        controller: 'AdminCtrl',
        resolve: {

        }
    });

    $stateProvider.state('adminHome.addCategory', {
        templateUrl: 'js/admin/add-category.html',
        controller: 'AdminCtrl',
    });
});
