'use strict';

app.controller('OrdersCtrl', function($scope, $state, OrdersFactory, orders, $log) {
  $scope.orders = orders;
  $scope.statusTypes = ["Active", "Complete", "Failed"];
});
