'use strict';

app.factory('ProductFactory', function($http) {
  return {
    getProduct: function(id) {
      return $http.get('/api/products/' + id)
      .then(function (response) {
        return response.data;
      });
    }
  }
});
