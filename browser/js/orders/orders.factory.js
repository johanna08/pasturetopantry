'use strict';

app.factory('OrdersFactory', function($http, $log) {
  function sendResponse(response) {
    return response.data;
  }

  return {
    getOrders: function() {
      return $http.get('api/orders/')
      .then(sendResponse)
      .catch($log.error);
    },
    getOneOrder: function(orderId) {
      return $http.get('api/orders/' + orderId)
      .then(sendResponse)
      .catch($log.error);
    },
    deleteOrder: function(orderId) {
      $http.delete('/api/orders/' + orderId)
      .then(sendResponse)
      .catch($log.error);
    },
    //e.g. update = {status: 'Active'}
    updateOrderStatus: function(orderId, updates) {
      $http.put('/api/orders/' + orderId, update)
      .then(sendResponse)
      .catch($log.error);
    },
    deleteOrderItem: function(orderId, productId) {
      $http.delete('/' + orderId + '/product/' + productId)
      .then(sendResponse)
      .catch($log.error);
    }
  }
});
