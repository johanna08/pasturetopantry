'use strict';

app.factory('UserFactory', function($http, $log, Session, ProductFactory, $state) {
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
      console.log(items);
      for (let item of items) ProductFactory.addToCart(item.productId, item.quantity);
      return null;
    },
    goToOrder: function(order) {
      $state.go('orderDetail', {orderId: order.id, order: order});
    }
  }
});
