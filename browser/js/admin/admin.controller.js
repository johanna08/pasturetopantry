'use strict';

app.controller('AdminCtrl', function($scope, AdminFactory, OrdersFactory, Products, categories, $log, products, $state, users) {
  $scope.categorySelection = {};
  $scope.categories = categories;
  $scope.products = products;
  $scope.users = users;
  $scope.displayProductCategories = AdminFactory.displayProductCategories;
  $scope.deleteProduct = AdminFactory.deleteProduct;
  $scope.addCategory = AdminFactory.addCategory;
  $scope.addAdmin = AdminFactory.addAdmin;
  $scope.removeAdmin = AdminFactory.removeAdmin;
  $scope.deleteUser = AdminFactory.deleteUser;
  $scope.deleteOrder = OrdersFactory.deleteOrder;

  $scope.changeOrderStatus = function(orderId, statusChange) {
    OrdersFactory.updateOrderStatus(orderId, {status: statusChange})
    .catch($log.error);
  }

  $scope.deleteCategory = function(){
    AdminFactory.deleteCategory($scope.categorySelected.id)
    .catch($log.error);
  }

  $scope.editCategory = function() {
    AdminFactory.editCategory($scope.categorySelected.id, $scope.newCategoryName)
    .catch($log.error);
  }

  $scope.addProduct = function(product) {
    //if the we have added new categories with the new product we are creating,
    //get the names and add them to the category database
    //not great, should be on factory, no time to refactor
    let selectedCategories = Object.keys($scope.categorySelection);
    let newCats = [];
    if ($scope.newCategories.length) newCats = $scope.newCategories.match(/[a-zA-Z]+/g);
    let categoryPromises = newCats.map(function(category) {
      return AdminFactory.addCategory({type_name: category})
      .then(function(category) {
        selectedCategories.push(category.type_name);
        $scope.categories.push(category);
      })
    });
    Promise.resolve(categoryPromises)
    .then(function(){
      AdminFactory.addProduct(product, $scope.categories, selectedCategories)
      .catch($log.error);
    })
  }
})
