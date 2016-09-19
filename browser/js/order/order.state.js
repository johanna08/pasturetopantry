'use strict';

app.config(function ($stateProvider) {
    $stateProvider.state('orderDetail', {
        url: '/order/:orderId',
        params: { order: null },
        templateUrl: 'js/order/order-details.html',
        controller: 'OrderCtrl',
        resolve: {
          order: function($stateParams) {
            return $stateParams.order;
          }
        }
    });
});
