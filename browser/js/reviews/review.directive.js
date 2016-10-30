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
      review: '=',

    },
    link: function(scope){
      scope.getStars = function(){
        let stars = [], i = 0;
        while (i < scope.review.rating){
          stars.push(i++);
        }
        return stars;
      };

      function getUsername(email){
        return email.split('@')[0];
      }
      scope.author = scope.review.user ? getUsername(scope.review.user.email) : "anonymous user";
    }
  }
});
