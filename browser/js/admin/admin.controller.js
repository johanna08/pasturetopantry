'use strict';

app.controller('AdminCtrl', function($scope, AdminFactory, Products, categories, $log, products) {
  $scope.categorySelection = {};
  $scope.categories = categories;
  $scope.products = products;
  $scope.displayProductCategories = AdminFactory.displayProductCategories;
  $scope.deleteProduct = AdminFactory.deleteProduct;

  $scope.addProduct = function(product) {
    AdminFactory.addProduct(product, $scope.categories, $scope.categorySelection)
    .catch($log.error);
  }

  $scope.deleteProduct = AdminFactory.deleteProduct;

})
