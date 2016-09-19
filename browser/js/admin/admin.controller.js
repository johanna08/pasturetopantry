'use strict';

app.controller('AdminCtrl', function($scope, $state, AdminFactory, Products, categories, $log) {
  $scope.categorySelection = {};
  $scope.categories = categories;


  $scope.addProduct = function(product) {
    let selectedCategories = Object.keys($scope.categorySelection)
    let categories = $scope.categories.reduce(function(arr, obj) {
      if (selectedCategories.includes(obj.type_name)) arr.push(obj.id);
      return arr;
    }, []);
    AdminFactory.addProduct({product: product, categories: categories})
    .then(function(product) {
      $state.go('product', { id: product.id });
    })
    .catch($log.error);
  }

})
