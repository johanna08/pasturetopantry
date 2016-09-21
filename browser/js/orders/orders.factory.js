'use strict';

app.factory('OrdersFactory', function($http, $log, $state) {
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
      return $http.delete('/api/orders/' + orderId)
      .then(sendResponse)
      .catch($log.error);
    },
    //e.g. update = {status: 'Active'}
    updateOrderStatus: function(orderId, update) {
      return $http.put('/api/orders/' + orderId, update)
      .then(sendResponse)
      .then(function(){
        $state.reload();
      })
      .catch($log.error);
    },
    deleteOrderItem: function(orderId, productId) {
      return $http.delete('/' + orderId + '/product/' + productId)
      .then(sendResponse)
      .catch($log.error);
    }
  }
});
