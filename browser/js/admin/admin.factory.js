'use strict';

app.factory('AdminFactory', function($http, $log) {
  function sendResponse(response) {
    return response.data;
  }

  return {
    //product is from controller scope added by ng-model in form -> product obj
    addProduct: function(product) {
      return $http.post('/api/products', product)
      .then(sendResponse)
      .catch($log.error);

    },
    deleteProduct: function(id) {
      return $http.delete('/api/products/' + id)
      .then(sendResponse)
      .catch($log.error);

    },
    getOrders: function() {
      return $http.get('api/reviews')
      .then(sendResponse)
      .catch($log.error);
    },
    addCategory: function(category) {
      return $http.post('/api/categories', category)
      .then(sendReponse)
      .catch($log.error);
    },
    deleteCategory: function(id) {
      return $http.delete('/api/categories' + id)
      .then(sendResponse)
      .catch($log.error);
    }
  }
});
