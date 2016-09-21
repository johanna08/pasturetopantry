'use strict';

app.config(function ($stateProvider) {

    $stateProvider.state('adminHome', {
        url: '/admin/home',
        templateUrl: 'js/admin/admin-home.html'
    });
    $stateProvider.state('addProduct', {
        url: '/products/add',
        templateUrl: 'js/admin/add-product.html',

        controller: 'AdminCtrl',
        resolve: {
          categories: function(Products) {
            return Products.getAllCategories();

          },
          products: function(Products) {
            return Products.fetchAll()
          }
      }
    });

    $stateProvider.state('adminHome.productList', {
        templateUrl: 'js/admin/product-list.html',
        controller: 'AdminCtrl',
        param: {products: null}
    });

    $stateProvider.state('adminHome.addProduct', {
        templateUrl: 'js/admin/add-product.html',
        controller: 'AdminCtrl',
    });

    $stateProvider.state('adminHome.addCategory', {
        templateUrl: 'js/admin/add-category.html',
        controller: 'AdminCtrl',

          })


    });
// });
