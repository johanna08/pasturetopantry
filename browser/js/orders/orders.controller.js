'use strict';

app.controller('OrdersCtrl', function($scope, $state, OrdersFactory, orders) {
  $scope.orders = orders;
  $scope.statusTypes = ['Active', 'Complete', 'Failed'];
});
