'use strict';

app.factory('ReviewFactory', function($http, $log) {
  function sendResponse(response) {
    return response.data;
  }
  //note, we have reviews included when you fetch a product, so we don't need
  // a special method for that here.
  return {
    submitReview: function(userId, productId, updates) {
      $http.post('api/reviews/user/' + userId + '/product/' + productId, updates)
      .then(sendResponse)
      .catch($log.error);
    },
    deleteReview: function(reviewId) {
      $http.delete('api/reviews/' + reviewId)
      .then(sendResponse)
      .catch($log.error);
    },
    updateReview: function(reviewId, updates) {
      $http.put('api/reviews/' + reviewId, updates)
      .then(sendResponse)
      .catch($log.error);
    },
    getReviews: function() {
      $http.get('api/reviews/')
      .then(sendResponse)
      .catch($log.error);
    }
  }
});
