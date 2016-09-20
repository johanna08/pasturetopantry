'use strict';

app.factory('AdminFactory', function($http, $log) {
  function sendResponse(response) {
    return response.data;
  }

  return {
    //product is from controller scope added by ng-model in form -> product obj
    addProduct: function(product, categories, selectCategories) {
      let addCategories = categories.reduce(function(arr, obj) {
        if (selectCategories.includes(obj.type_name)) arr.push(obj.id);
        return arr;
      }, []);
      return $http.post('/api/products', {product: product, categories: addCategories})
      .then(sendResponse);
    },
    deleteProduct: function(id) {
      return $http.delete('/api/products/' + id)
      .then(sendResponse);

    },
    getOrders: function() {
      return $http.get('api/reviews')
      .then(sendResponse);
    },
    addCategory: function(category) {
      return $http.post('/api/categories', category)
      .then(sendResponse);
    },
    deleteCategory: function(id) {
      return $http.delete('/api/categories' + id)
      .then(sendResponse);
    },
    displayProductCategories: function(product) {
      return product.categories.map(category => category.type_name).join(', ');
    }
  }
});
