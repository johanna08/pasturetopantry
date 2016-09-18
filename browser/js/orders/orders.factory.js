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
    }
  }
});
