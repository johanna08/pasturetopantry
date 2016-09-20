app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeController'
    });
});

app.controller('HomeController', function ($scope, FarmPics) {

    // Images of beautiful Fullstack people.
    $scope.images = _.shuffle(FarmPics);

});
