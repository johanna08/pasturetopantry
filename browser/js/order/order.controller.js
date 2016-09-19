'use strict';

app.controller('OrderCtrl', function($scope, $state, OrderFactory, order) {
  $scope.order = order;
  console.log($scope.order.items);
  $scope.orderTotal = OrderFactory.cartTotal($scope.order.items);
});
