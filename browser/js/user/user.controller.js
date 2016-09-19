'use strict';

app.controller('UserCtrl', function($scope, $state, UserFactory, userData) {
  //similar to OrderCtrl...
  $scope.orders = userData.orders;
  var Session = UserFactory.getSessionUser();

  $scope.statusTypes = ['Active', 'Complete', 'Failed'];

  $scope.reorder = UserFactory.reorder;

  $scope.goToOrder = UserFactory.goToOrder;
});
