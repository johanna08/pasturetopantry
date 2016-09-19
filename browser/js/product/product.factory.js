'use strict';

app.factory('ProductFactory', function($http) {
  return {
    //note, getProduct retrieves a product object with a property reviews
    //which includes all its product reviews
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
