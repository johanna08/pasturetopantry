'use strict';

app.config(function ($stateProvider) {
    $stateProvider.state('adminHome.allorders', {
        templateUrl: 'js/orders/all-orders.html',
        controller: 'OrdersCtrl',
        resolve: {
          orders: function(OrdersFactory) {
            return OrdersFactory.getOrders();
          }
        }
    });
});
