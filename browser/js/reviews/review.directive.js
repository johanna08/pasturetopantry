'use strict'

app.directive('submitReview', function(ReviewFactory) {
  return {
    restrict: 'E',
    templateUrl: 'js/reviews/review-form.html',
    replace: true,
    scope: {
      userId: '=',
      productId: '='

    },
    link: function(scope, elem, attrs){
        scope.submitReview = function(){
            ReviewFactory.submitReview(scope.userId, scope.productId, scope.review)
            .then(function(){
              scope.review = null;
            });
        }
    }
  }
})
