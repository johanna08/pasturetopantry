'use strict';

app.config(function ($stateProvider) {
    $stateProvider.state('userOrders', {
        url: '/user/orders',
        templateUrl: 'js/user/user-orders.html',
        controller: 'UserCtrl',
        resolve: {
          userData: function(UserFactory) {
            let userId = UserFactory.getSessionUser();
            return UserFactory.getUsersOrders(userId);
          }
        }
    });
});
