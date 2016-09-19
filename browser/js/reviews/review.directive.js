'use strict'

app.directive('submitReview', function(ReviewFactory, $state) {
  return {
    restrict: 'E',
    templateUrl: 'js/reviews/review-form.html',
    // replace: true,
    scope: {
      userId: '=',
      productId: '='

    },
    link: function(scope, elem, attrs){
        scope.submitReview = function(){
            ReviewFactory.submitReview(scope.userId, scope.productId, scope.review)
            .then(function(){
              scope.review = null;
              $state.reload();
            });
        }
    }
  }
})

app.directive('review', function(){
  return {
    restrict: 'E',
    templateUrl: 'js/reviews/review.html',
    scope: {
      review: '='
    }
  }
});
