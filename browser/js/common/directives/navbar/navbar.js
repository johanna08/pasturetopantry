app.directive('navbar', function($rootScope, AuthService, AUTH_EVENTS, $state, $sessionStorage, ProductFactory) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function(scope) {

            scope.items = [
                { label: 'Products', state: 'products' },
                { label: 'Home', state: 'home' },
                { label: 'About', state: 'about' },
                { label: 'Documentation', state: 'docs' },
                { label: 'Members Only', state: 'membersOnly', auth: true }
            ];

            scope.user = null;

            scope.isLoggedIn = function() {
                return AuthService.isAuthenticated();
            };

            scope.logout = function() {
                AuthService.logout().then(function() {
                    $state.go('home');
                });
            };

            var setUser = function() {
                AuthService.getLoggedInUser().then(function(user) {
                    scope.user = user;
                });
            };

            var removeUser = function() {
                scope.user = null;
            };

            scope.products = []; //need to loop and display as rows

            scope.getCart = function() {
                for (var i = 0; i < $sessionStorage.cart.length; i++) {
                    ProductFactory.getProduct($sessionStorage.cart[i].id)
                        .then(function(product) {
                            for (var i = 0; i < scope.products.length; i++) {
                                if (scope.products[i].id === product.id) {
                                    var inCart = true;
                                }
                            }
                            if (!inCart) {
                                scope.products.push(product);
                            }
                        });
                }


                $rootScope.$emit('cartClick', scope.products);
            }


            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

        }

    };

});
