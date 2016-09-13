'use strict';

app.factory('AdminFactory', function($http) {
  return {
    //product is from controller scope added by ng-model in form -> product obj
    addProduct: function(product) {
      return $http.post('/api/products', product)
      .then(function (response) {
        return response.data;
      });
    },
    deleteProduct: function(id) {
      return $http.delete('/api/products/' + id)
      .then(function (response) {
        return response.data;
      });
    }
  }
})
