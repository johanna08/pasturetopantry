'use strict';

app.controller('AdminCtrl', function($scope, $state, AdminFactory, Products, categories, $log) {
  $scope.categorySelection = {};
  $scope.categories = categories;


  $scope.addProduct = function(product) {
    let selectedCategories = Object.keys($scope.categorySelection);
    let prodCategories = $scope.categories.reduce(function(arr, obj) {
      if (selectedCategories.includes(obj.type_name)) arr.push(obj.id);
      return arr;
    }, []);
    AdminFactory.addProduct({product: product, categories: prodCategories})
    .then(function(addedProduct) {
      $state.go('product', { id: addedProduct.id });
    })
    .catch($log.error);
  }

})
