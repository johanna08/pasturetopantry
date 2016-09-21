'use strict';

app.factory('UserFactory', function($http, $log, Session, ProductFactory, $state, OrdersFactory) {
  function sendResponse(response) {
    return response.data;
  }

  return {
    getUsersOrders: function(userId) {
      return $http.get('/api/users/' + userId)
      .then(sendResponse)
      .catch($log.error);
    },
    getSessionUser: function() {
      if (Session.user) return Session.user.id;
      return null;
    },
    //adds items from past order to cart
    reorder: function(items) {
      for (let item of items) ProductFactory.addToCart(item.productId, item.quantity);
    },
    //delete order from database
    //clear cart
    cancelOrder: function(orderId) {
      OrdersFactory.updateOrderStatus(orderId, {status: 'Failed'})
      .then(function(order){
        Session.resetSessionCart();
      })
      .then(function(){
        $state.reload();
      })
    }
  }
});
