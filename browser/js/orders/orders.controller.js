'use strict';

app.controller('OrdersCtrl', function($scope, $state, OrdersFactory, orders, OrderFactory) {
  $scope.orders = orders;
  var allStatusTypes = ['Active', 'Complete', 'Failed'];
  $scope.statusTypes = ['All', 'Active', 'Complete', 'Failed'];

  $scope.allStatus = function() {
    console.log($scope.statusSearch, allStatusTypes, $scope.statusTypes);
    if ($scope.statusSearch === 'All') $scope.statusSearch = allStatusTypes;
  }

  $scope.orderTotal = OrderFactory.cartTotal;
});
