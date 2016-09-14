'use strict';

app.controller('AdminCtrl', function($scope, $state, AdminFactory, $log) {

  $scope.addProduct = function(product) {
    AdminFactory.addProduct(product)
    .then(function(product) {
      $state.go('product', { id: product.id });
    })
    .catch($log.error);
  }

})
