'use strict';

app.factory('ProductFactory', function($http) {
  return {
    getProduct: function(id) {
      return $http.get('/api/products/item/' + id)
      .then(function (response) {
        return response.data;
      });
    },
    addToCart: function(id, quantity) {
      return $http.get('/api/products/item/' + id)
      .then(function (response) {
        return response.data;
      })
    }
  }
});
