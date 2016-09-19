'use strict';

app.controller('OrderCtrl', function($scope, $state, OrderFactory, order) {
  $scope.order = order;
});
