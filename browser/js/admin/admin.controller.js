'use strict';

app.controller('AdminCtrl', function($scope, AdminFactory, Products, categories, $log, products,$state) {
  $scope.categorySelection = {};
  $scope.categories = categories;
  $scope.products = products;
  $scope.displayProductCategories = AdminFactory.displayProductCategories;
  $scope.deleteProduct = AdminFactory.deleteProduct;
  $scope.addCategory = AdminFactory.addCategory;

  $scope.deleteCategory = function(){
    AdminFactory.deleteCategory($scope.categorySelected.id)
    .then(function(){
      $state.reload();
    })
    .catch($log.error);
  }

  $scope.editCategory = function() {
    AdminFactory.editCategory($scope.categorySelected.id, $scope.newCategoryName)
    .then(function(){
      $state.reload();
    })
    .catch($log.error);
  }

  $scope.addProduct = function(product) {
    //if the we have added new categories with the new product we are creating,
    //get the names and add them to the category database
    //then add the names to the categories array & $scope.categories selection object
    //not great, should be on factory, no time to refactor
    let selectedCategories = Object.keys($scope.categorySelection);
    let newCats;
    if ($scope.newCategories.length) newCats = $scope.newCategories.match(/[a-zA-Z]+/g);
    let categoryPromises = newCats.map(function(category) {
      return AdminFactory.addCategory({type_name: category})
      .then(function(category) {
        console.log(category);
        $scope.categories.push(category.type_name);
        return selectedCategories.push(category.type_name);
      })
    });
    Promise.resolve(categoryPromises)
    .then(function(){
      AdminFactory.addProduct(product, $scope.categories, selectedCategories)
      .catch($log.error);
    })
  }
})
