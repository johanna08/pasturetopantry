app.factory('CartFactory', function($http, $log, $sessionStorage, Session){
  function sendResponse(response){
    return response.data;
  }

  let factoryObj = {
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
      userCheckout: function(userId, token, email){
        return $http.put('api/order/' + userId + '/checkout', {token, email})
        .then(sendResponse)
        .catch($log.error);
      },
    //checkout as a non-user
    //products should be an aray of objects {products: [{productId, quantity}]}
      nonUserCheckout: function(products, token, email){
        return $http.post('api/order/checkout', {products, token, email})
        .then(sendResponse)
        .catch($log.error);
      },
      getSessionUser: function() {
        if (Session.user) return Session.user.id;
        return null;
      }
  }
  //add this onto factoryObj so can use existing factory methods
  factoryObj.syncSessionCartToDb = function() {
    let user = Session.user;
    if (!$sessionStorage.cart) $sessionStorage.cart = [];
        console.log('SESSIONSTORAGECART AT BEGINNING OF LOGIN PROCESS', $sessionStorage.cart);

        if ($sessionStorage.cart.length){
             return factoryObj.mergeMyCart(user.id, {updates: $sessionStorage.cart})
             .then(function(){
                console.log('LOGIN INITIATED MERGE');
                return factoryObj.fetchMyCart(user.id);
             })
             .then(function(result){
                //we only need item quantity and productID on storagesessions
                //when we build the cart we fetch the product by id anyway
                $sessionStorage.cart = result.items.map(function(cartItem){ return {id: cartItem.productId, quantity: cartItem.quantity}});
                console.log('SESSIONSTORAGECART AT END OF LOGIN PROCESS', $sessionStorage.cart);
                  return user;
             });
        } else {
            return factoryObj.fetchMyCart(user.id)
            .then(function(result){
                console.log('LOGIN INITIATED FETCH MY CART, NO MERGE');
                //we only need item quantity and productID on storagesessions
                //when we build the cart we fetch the product by id anyway
                $sessionStorage.cart = result.items.map(function(cartItem){ return {id: cartItem.productId, quantity: cartItem.quantity}});
                    console.log('SESSIONSTORAGECART AT END OF LOGIN PROCESS', $sessionStorage.cart);
                return user;
             });
        }
  }

  return factoryObj;
});
