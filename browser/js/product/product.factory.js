'use strict';

app.factory('ProductFactory', function($http, $sessionStorage) {
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
        let items = $sessionStorage.cart.map(item => item.id);
        let addedItemIdx = items.indexOf(id);
        if (addedItemIdx !== -1) {
            $sessionStorage.cart[addedItemIdx].quantity += quantity;
        } else if (addedItemIdx === -1 || !$sessionStorage.cart.length){
            $sessionStorage.cart.push({ id: id, quantity: quantity });
        }
    }
  }
});
