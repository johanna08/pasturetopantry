'use strict';

app.controller('OrderCtrl', function($scope, $state, OrderFactory, order) {
  $scope.order = order;
  $scope.orderTotal = OrderFactory.cartTotal($scope.order.items);
});
