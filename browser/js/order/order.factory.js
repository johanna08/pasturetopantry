'use strict';

app.factory('OrderFactory', function($http, $log) {
  function sendResponse(response) {
    return response.data;
  }

  return {
      //pass it items array of items object with product property that includes price
      cartTotal: function(items) {
        return items.reduce(function(total, item){
          return total + Number(item.product.dollarPrice);
        }, 0)
      }
  }
});
