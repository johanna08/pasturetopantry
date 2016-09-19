'use strict'

app.directive('submitReview', function() {
  return {
    restrict: 'E',
    templateUrl: 'js/reviews/review-form.html',
    replace: true
  }
})
