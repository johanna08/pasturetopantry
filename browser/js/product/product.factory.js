'use strict';

app.factory('ProductFactory', function($http) {
  return {
    getProduct: function(id) {
      return $http.get('/api/products/item/' + id)
      .then(function (response) {
        return response.data;
      });
    },
    //these are fundamentally the same, why don't we just use getProduct????
    addToCart: function(id, quantity) {
      return $http.get('/api/products/item/' + id)
      .then(function (response) {
        return response.data;
      })
    }
  }
});
