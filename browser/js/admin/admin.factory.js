'use strict';

app.factory('AdminFactory', function($http, $log, $state) {
  function sendResponse(response) {
    return response.data;
  }

  return {
    //product is from controller scope added by ng-model in form -> product obj
    addProduct: function(product, categories, selectCategories) {
      let addCategories = categories.reduce(function(arr, obj) {
        console.log(obj.type_name);
        if (selectCategories.includes(obj.type_name)) arr.push(obj.id);
        return arr;
      }, []);
      return $http.post('/api/products', {product: product, categories: addCategories})
      .then(sendResponse)
      .then(function(){
        $state.reload();
      });
    },
    deleteProduct: function(id) {
      return $http.delete('/api/products/' + id)
      .then(sendResponse)
      .then(function(){
        $state.reload();
      });

    },
    getOrders: function() {
      return $http.get('api/reviews')
      .then(sendResponse);
    },
    addCategory: function(category) {
      console.log(category)
      return $http.post('/api/categories/', category)
      .then(sendResponse)
    },
    deleteCategory: function(id) {
      return $http.delete('/api/categories/' + id)
      .then(sendResponse)
      .then(function(){
        $state.reload();
      });
    },
    editCategory: function(categoryId, newCategoryName) {
      return $http.put('/api/categories', {id: categoryId, type_name: newCategoryName})
      .then(sendResponse)
      .then(function(){
        $state.reload();
      });
    },
    displayProductCategories: function(product) {
      return product.categories.map(category => category.type_name).join(', ');
    },
    getUsers: function() {
      return $http.get('/api/users')
      .then(sendResponse);
    },
    deleteUser: function(userId) {
      $http.delete('/api/users/' + userId)
      .then(sendResponse)
      .then(function(){
        $state.reload();
      });
    },
    addAdmin(userId) {
      $http.put('/api/users/' + userId, {isAdmin: true})
      .then(sendResponse)
      .then(function(){
        $state.reload();
      });
    },
    removeAdmin(userId) {
      $http.put('/api/users/' + userId, {isAdmin: false})
      .then(sendResponse)
      .then(function(){
        $state.reload();
      });
    }
  }
});
