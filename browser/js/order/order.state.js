'use strict';

app.config(function ($stateProvider) {
    $stateProvider.state('orderDetail', {
        url: '/order/:orderId',
        templateUrl: 'js/order/order-details.html',
        controller: 'OrderCtrl',
        resolve: {
          order: function($stateParams) {
            console.log($stateParams);
            return $stateParams.order;
          }
        }
    });
});
