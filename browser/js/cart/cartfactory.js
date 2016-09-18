app.factory('CartFactory', function($http, $log, $sessionStorage, ProductFactory){
  function sendResponse(response){
    return response.data;
  }

  return {
    //get all items in user's cart
      fetchMyCart: function(userId){
        return $http.get('/api/order/' + userId)
        .then(sendResponse)
        .catch($log.error);
      },
    //merge items in users cart with db cart
    //updates sould be an array
      mergeMyCart: function(userId, updates){
        console.log('UPDATES PASSED TO MERGEMYCART IN CART FACTORY: ', updates);
        return $http.put('/api/order/' + userId + '/merge', updates)
        .then(sendResponse)
        .catch($log.error)
      },
    //delete one item in user's cart
      deleteOne: function(userId, productId){
        return $http.delete('/api/order/' + userId + '/product/' + productId)
        .then(sendResponse)
        .catch($log.error);
      },
    //clear entire cart
      deleteAll: function(userId){
        return $http.delete('/api/order/' + userId)
        .then(sendResponse)
        .catch($log.error);
      },
    //checkout as a user
      userCheckout: function(userId){
        return $http.put('api/order/' + userId + '/checkout')
        .then(sendResponse)
        .catch($log.error);
      },
    //checkout as a non-user
    //products should be an aray of objects {products: [{productId, quantity}]}
      nonUserCheckout: function(products){
        return $http.post('api/order/checkout', {products})
        .then(sendResponse)
        .catch($log.error);
      }
  }
});
