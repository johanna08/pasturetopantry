'use strict';

app.controller('ProductCtrl', function($scope, ProductFactory, $log, product) {
  $scope.product = product;
});
