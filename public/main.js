'use strict';

window.app = angular.module('FullstackGeneratedApp', ['fsaPreBuilt', 'ui.router', 'ui.bootstrap', 'ngAnimate', 'ngStorage']);

app.config(function ($urlRouterProvider, $locationProvider) {
    // This turns off hashbang urls (/#about) and changes it to something normal (/about)
    $locationProvider.html5Mode(true);
    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise('/');
    // Trigger page refresh when accessing an OAuth route
    $urlRouterProvider.when('/auth/:provider', function () {
        window.location.reload();
    });
});

// This app.run is for controlling access to specific states.
app.run(function ($rootScope, AuthService, $state) {

    // The given state requires an authenticated user.
    var destinationStateRequiresAuth = function destinationStateRequiresAuth(state) {
        return state.data && state.data.authenticate;
    };

    // $stateChangeStart is an event fired
    // whenever the process of changing a state begins.
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

        if (!destinationStateRequiresAuth(toState)) {
            // The destination state does not require authentication
            // Short circuit with return.
            return;
        }

        if (AuthService.isAuthenticated()) {
            // The user is authenticated.
            // Short circuit with return.
            return;
        }

        // Cancel navigating to new state.
        event.preventDefault();

        AuthService.getLoggedInUser().then(function (user) {
            // If a user is retrieved, then renavigate to the destination
            // (the second time, AuthService.isAuthenticated() will work)
            // otherwise, if no user is logged in, go to "login" state.
            if (user) {
                $state.go(toState.name, toParams);
            } else {
                $state.go('login');
            }
        });
    });
});

app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('about', {
        url: '/about',
        controller: 'AboutController',
        templateUrl: 'js/about/about.html'
    });
});

app.controller('AboutController', function ($scope, FullstackPics) {

    // Images of beautiful Fullstack people.
    $scope.images = _.shuffle(FullstackPics);
});

'use strict';

app.controller('AdminCtrl', function ($scope, $state, AdminFactory, Products, categories, $log) {
    $scope.categorySelection = {};
    $scope.categories = categories;

    $scope.addProduct = function (product) {
        var selectedCategories = Object.keys($scope.categorySelection);
        var categories = $scope.categories.reduce(function (arr, obj) {
            if (selectedCategories.includes(obj.type_name)) arr.push(obj.id);
            return arr;
        }, []);
        AdminFactory.addProduct({ product: product, categories: categories }).then(function (product) {
            $state.go('product', { id: product.id });
        }).catch($log.error);
    };
});

'use strict';

app.factory('AdminFactory', function ($http) {
    return {
        //product is from controller scope added by ng-model in form -> product obj
        addProduct: function addProduct(product) {
            return $http.post('/api/products', product).then(function (response) {
                return response.data;
            });
        },
        deleteProduct: function deleteProduct(id) {
            return $http.delete('/api/products/' + id).then(function (response) {
                return response.data;
            });
        }
    };
});

'use strict';

app.config(function ($stateProvider) {
    $stateProvider.state('addProduct', {
        url: '/products/add',
        templateUrl: 'js/admin/add-product.html',
        controller: 'AdminCtrl',
        resolve: {
            categories: function categories(Products) {
                return Products.getAllCategories();
            }
        }
    });
});

'use strict';
app.controller('CartCtrl', function ($scope, ProductFactory, $sessionStorage, products) {

    $scope.products = products;

    $scope.Range = function (start, end) {
        var result = [];
        for (var i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    };

    $scope.getQuantity = function (id) {
        for (var i = 0; i < $sessionStorage.cart.length; i++) {
            if ($sessionStorage.cart[i].id === id) return $sessionStorage.cart[i].quantity;
        }
    };

    $scope.total = function () {
        var total = 0;

        for (var i = 0; i < $scope.products.length; i++) {
            total += $scope.products[i].totalCost;
        }

        return total;
    };
});

app.config(function ($stateProvider) {
    $stateProvider.state('cart', {
        url: '/cart',
        templateUrl: 'js/cart/cart.html',
        controller: 'CartCtrl',
        resolve: {
            products: function products($sessionStorage, ProductFactory) {
                var products = [];
                if ($sessionStorage.cart) {
                    for (var i = 0; i < $sessionStorage.cart.length; i++) {
                        ProductFactory.getProduct($sessionStorage.cart[i].id).then(function (product) {
                            for (var i = 0; i < products.length; i++) {
                                if (products[i].id === product.id) {
                                    var inCart = true;
                                }
                            }
                            if (!inCart) {
                                products.push(product);
                            }
                        });
                    }
                }
                return products;
            }
        }
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('checkout', {
        url: '/checkout',
        templateUrl: 'js/checkout/checkout.html',
        controller: 'CartCtrl',
        resolve: {
            products: function products($sessionStorage, ProductFactory) {
                var products = [];
                if ($sessionStorage.cart) {
                    for (var i = 0; i < $sessionStorage.cart.length; i++) {
                        ProductFactory.getProduct($sessionStorage.cart[i].id).then(function (product) {

                            for (var i = 0; i < products.length; i++) {
                                if (products[i].id === product.id) {
                                    var inCart = true;
                                }
                            }
                            if (!inCart) {
                                product.totalCost = $sessionStorage.cart[i].quantity * product.price;
                                products.push(product);
                            }
                        });
                    }
                }
                return products;
            }
        }
    });
});

$(function () {
    var $form = $('#payment-form');
    $form.submit(function (event) {
        // Disable the submit button to prevent repeated clicks:
        $form.find('.submit').prop('disabled', true);
        // Request a token from Stripe:
        Stripe.card.createToken($form, stripeResponseHandler);
        // Prevent the form from being submitted:
        return false;
    });
});

function stripeResponseHandler(status, response) {
    // Grab the form:
    var $form = $('#payment-form');
    if (response.error) {
        // Problem!
        // Show the errors on the form:
        $form.find('.payment-errors').text(response.error.message);
        $form.find('.submit').prop('disabled', false); // Re-enable submission
    } else {
        // Token was created!
        // Get the token ID:
        var token = response.id;
        // Insert the token ID into the form so it gets submitted to the server:
        $form.append($('<input type="hidden" name="stripeToken">').val(token));
        // Submit the form:
        $form.get(0).submit();
    }
}

app.config(function ($stateProvider) {
    $stateProvider.state('docs', {
        url: '/docs',
        templateUrl: 'js/docs/docs.html'
    });
});

(function () {

    'use strict';

    // Hope you didn't forget Angular! Duh-doy.

    if (!window.angular) throw new Error('I can\'t find Angular!');

    var app = angular.module('fsaPreBuilt', []);

    app.factory('Socket', function () {
        if (!window.io) throw new Error('socket.io not found!');
        return window.io(window.location.origin);
    });

    // AUTH_EVENTS is used throughout our app to
    // broadcast and listen from and to the $rootScope
    // for important events about authentication flow.
    app.constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    });

    app.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
        var statusDict = {
            401: AUTH_EVENTS.notAuthenticated,
            403: AUTH_EVENTS.notAuthorized,
            419: AUTH_EVENTS.sessionTimeout,
            440: AUTH_EVENTS.sessionTimeout
        };
        return {
            responseError: function responseError(response) {
                $rootScope.$broadcast(statusDict[response.status], response);
                return $q.reject(response);
            }
        };
    });

    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push(['$injector', function ($injector) {
            return $injector.get('AuthInterceptor');
        }]);
    });

    app.service('AuthService', function ($http, Session, $rootScope, AUTH_EVENTS, $q) {

        function onSuccessfulLogin(response) {
            var user = response.data;
            Session.create(user);
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            return user;
        }

        // Uses the session factory to see if an
        // authenticated user is currently registered.
        this.isAuthenticated = function () {
            return !!Session.user;
        };

        this.getLoggedInUser = function (fromServer) {

            // If an authenticated session exists, we
            // return the user attached to that session
            // with a promise. This ensures that we can
            // always interface with this method asynchronously.

            // Optionally, if true is given as the fromServer parameter,
            // then this cached value will not be used.

            if (this.isAuthenticated() && fromServer !== true) {
                return $q.when(Session.user);
            }

            // Make request GET /session.
            // If it returns a user, call onSuccessfulLogin with the response.
            // If it returns a 401 response, we catch it and instead resolve to null.
            return $http.get('/session').then(onSuccessfulLogin).catch(function () {
                return null;
            });
        };

        this.signup = function (credentials) {
            return $http.post('/api/signup', credentials).then(function (response) {
                return response;
            }).then(onSuccessfulLogin).catch(function () {
                return $q.reject({ message: 'Signup unsuccessful.' });
            });
        };

        this.login = function (credentials) {
            return $http.post('/api/login', credentials).then(onSuccessfulLogin).catch(function () {
                return $q.reject({ message: 'Invalid login credentials.' });
            });
        };

        this.logout = function () {
            return $http.post('/api/logout').then(function () {
                Session.destroy();
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            });
        };
    });

    app.service('Session', function ($rootScope, AUTH_EVENTS) {

        var self = this;

        $rootScope.$on(AUTH_EVENTS.notAuthenticated, function () {
            self.destroy();
        });

        $rootScope.$on(AUTH_EVENTS.sessionTimeout, function () {
            self.destroy();
        });

        this.user = null;

        this.create = function (user) {
            this.user = user;
        };

        this.destroy = function () {
            this.user = null;
        };
    });
})();

app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html'
    });
});

app.config(function ($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });
});

app.controller('LoginCtrl', function ($scope, AuthService, $state) {

    $scope.login = {};
    $scope.error = null;

    $scope.sendLogin = function (loginInfo) {

        $scope.error = null;

        AuthService.login(loginInfo).then(function () {
            $state.go('home');
        }).catch(function () {
            $scope.error = 'Invalid login credentials.';
        });
    };
});

app.config(function ($stateProvider) {

    $stateProvider.state('membersOnly', {
        url: '/members-area',
        template: '<img ng-repeat="item in stash" width="300" ng-src="{{ item }}" />',
        controller: function controller($scope, SecretStash) {
            SecretStash.getStash().then(function (stash) {
                $scope.stash = stash;
            });
        },
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        }
    });
});

app.factory('SecretStash', function ($http) {

    var getStash = function getStash() {
        return $http.get('/api/members/secret-stash').then(function (response) {
            return response.data;
        });
    };

    return {
        getStash: getStash
    };
});

'use strict';

app.controller('ProductCtrl', function ($scope, ProductFactory, $log, $sessionStorage, product) {
    $scope.product = product;

    $scope.Range = function (start, end) {
        var result = [];
        for (var i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    };

    if (!$sessionStorage.cart) {
        $sessionStorage.cart = [];
    }

    $scope.addToCart = function (id, quantity) {
        for (var i = 0; i < $sessionStorage.cart.length; i++) {
            if ($sessionStorage.cart[i].id === id) {
                var inCart = true;
                $sessionStorage.cart[i].quantity += quantity;
            }
        }

        if (!inCart) {
            $sessionStorage.cart.push({ id: id, quantity: quantity });
        }

        console.log($sessionStorage.cart);
    };
});

'use strict';

app.factory('ProductFactory', function ($http) {
    return {
        getProduct: function getProduct(id) {
            return $http.get('/api/products/item/' + id).then(function (response) {
                return response.data;
            });
        },
        addToCart: function addToCart(id, quantity) {
            return $http.get('/api/products/item/' + id).then(function (response) {
                return response.data;
            });
        }
    };
});

'use strict';

app.config(function ($stateProvider) {
    $stateProvider.state('product', {
        url: '/products/:id',
        templateUrl: 'js/product/product.html',
        controller: 'ProductCtrl',
        resolve: {
            product: function product(ProductFactory, $stateParams) {
                return ProductFactory.getProduct($stateParams.id);
            }
        }
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('products', {
        url: '/products',
        templateUrl: 'js/products/products.html',
        controller: function controller($scope, Products) {
            Products.fetchAll().then(function (response) {
                $scope.products = response;
            });

            Products.getAllCategories().then(function (response) {
                $scope.categories = response;
            });

            $scope.productsByCategory = function (id) {
                Products.fetchByCategory(id).then(function (response) {
                    $scope.products = response;
                });
            };
        }
    });
});

app.factory('Products', function ($http, $log) {
    return {
        fetchAll: function fetchAll() {
            return $http.get('/api/products/').then(function (response) {
                return response.data;
            }).catch($log.error);
        },

        getAllCategories: function getAllCategories() {
            return $http.get('/api/products/allcategories').then(function (response) {
                return response.data;
            }).catch($log.error);
        },

        fetchByCategory: function fetchByCategory(id) {
            return $http.get('/api/products/categories/' + id).then(function (response) {
                return response.data;
            }).catch($log.error);
        }
    };
});

app.config(function ($stateProvider) {

    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'js/signup/signup.html',
        controller: 'SignupCtrl'
    });
});

app.controller('SignupCtrl', function ($scope, AuthService, $state) {

    $scope.signup = {};
    $scope.error = null;

    $scope.sendSignup = function (signupInfo) {

        $scope.error = null;

        AuthService.signup(signupInfo).then(function () {
            $state.go('home');
        }).catch(function () {
            $scope.error = 'This email is invalid OR email already exists.';
        });
    };
});

app.factory('FullstackPics', function () {
    return ['https://pbs.twimg.com/media/B7gBXulCAAAXQcE.jpg:large', 'https://fbcdn-sphotos-c-a.akamaihd.net/hphotos-ak-xap1/t31.0-8/10862451_10205622990359241_8027168843312841137_o.jpg', 'https://pbs.twimg.com/media/B-LKUshIgAEy9SK.jpg', 'https://pbs.twimg.com/media/B79-X7oCMAAkw7y.jpg', 'https://pbs.twimg.com/media/B-Uj9COIIAIFAh0.jpg:large', 'https://pbs.twimg.com/media/B6yIyFiCEAAql12.jpg:large', 'https://pbs.twimg.com/media/CE-T75lWAAAmqqJ.jpg:large', 'https://pbs.twimg.com/media/CEvZAg-VAAAk932.jpg:large', 'https://pbs.twimg.com/media/CEgNMeOXIAIfDhK.jpg:large', 'https://pbs.twimg.com/media/CEQyIDNWgAAu60B.jpg:large', 'https://pbs.twimg.com/media/CCF3T5QW8AE2lGJ.jpg:large', 'https://pbs.twimg.com/media/CAeVw5SWoAAALsj.jpg:large', 'https://pbs.twimg.com/media/CAaJIP7UkAAlIGs.jpg:large', 'https://pbs.twimg.com/media/CAQOw9lWEAAY9Fl.jpg:large', 'https://pbs.twimg.com/media/B-OQbVrCMAANwIM.jpg:large', 'https://pbs.twimg.com/media/B9b_erwCYAAwRcJ.png:large', 'https://pbs.twimg.com/media/B5PTdvnCcAEAl4x.jpg:large', 'https://pbs.twimg.com/media/B4qwC0iCYAAlPGh.jpg:large', 'https://pbs.twimg.com/media/B2b33vRIUAA9o1D.jpg:large', 'https://pbs.twimg.com/media/BwpIwr1IUAAvO2_.jpg:large', 'https://pbs.twimg.com/media/BsSseANCYAEOhLw.jpg:large', 'https://pbs.twimg.com/media/CJ4vLfuUwAAda4L.jpg:large', 'https://pbs.twimg.com/media/CI7wzjEVEAAOPpS.jpg:large', 'https://pbs.twimg.com/media/CIdHvT2UsAAnnHV.jpg:large', 'https://pbs.twimg.com/media/CGCiP_YWYAAo75V.jpg:large', 'https://pbs.twimg.com/media/CIS4JPIWIAI37qu.jpg:large'];
});

app.factory('RandomGreetings', function () {

    var getRandomFromArray = function getRandomFromArray(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    };

    var greetings = ['Hello, world!', 'At long last, I live!', 'Hello, simple human.', 'What a beautiful day!', 'I\'m like any other project, except that I am yours. :)', 'This empty string is for Lindsay Levine.', 'こんにちは、ユーザー様。', 'Welcome. To. WEBSITE.', ':D', 'Yes, I think we\'ve met before.', 'Gimme 3 mins... I just grabbed this really dope frittata', 'If Cooper could offer only one piece of advice, it would be to nevSQUIRREL!'];

    return {
        greetings: greetings,
        getRandomGreeting: function getRandomGreeting() {
            return getRandomFromArray(greetings);
        }
    };
});

app.directive('fullstackLogo', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/fullstack-logo/fullstack-logo.html'
    };
});

app.directive('navbar', function ($rootScope, AuthService, AUTH_EVENTS, $state) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function link(scope) {

            scope.items = [{ label: 'Products', state: 'products' }, { label: 'Home', state: 'home' }, { label: 'About', state: 'about' }, { label: 'Documentation', state: 'docs' }, { label: 'Members Only', state: 'membersOnly', auth: true }];

            scope.user = null;

            scope.isLoggedIn = function () {
                return AuthService.isAuthenticated();
            };

            scope.logout = function () {
                AuthService.logout().then(function () {
                    $state.go('home');
                });
            };

            var setUser = function setUser() {
                AuthService.getLoggedInUser().then(function (user) {
                    scope.user = user;
                });
            };

            var removeUser = function removeUser() {
                scope.user = null;
            };

            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);
        }

    };
});

app.directive('pastureToPantryLogo', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/pasturetopantry-logo/ptp.html'
    };
});

app.directive('randoGreeting', function (RandomGreetings) {

    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/rando-greeting/rando-greeting.html',
        link: function link(scope) {
            scope.greeting = RandomGreetings.getRandomGreeting();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmpzIiwiYWRtaW4vYWRtaW4uY29udHJvbGxlci5qcyIsImFkbWluL2FkbWluLmZhY3RvcnkuanMiLCJhZG1pbi9hZG1pbi5zdGF0ZS5qcyIsImNhcnQvY2FydC5qcyIsImNoZWNrb3V0L2NoZWNrb3V0LmpzIiwiY2hlY2tvdXQvc3RyaXBlLmpzIiwiZG9jcy9kb2NzLmpzIiwiZnNhL2ZzYS1wcmUtYnVpbHQuanMiLCJob21lL2hvbWUuanMiLCJsb2dpbi9sb2dpbi5qcyIsIm1lbWJlcnMtb25seS9tZW1iZXJzLW9ubHkuanMiLCJwcm9kdWN0L3Byb2R1Y3QuY29udHJvbGxlci5qcyIsInByb2R1Y3QvcHJvZHVjdC5mYWN0b3J5LmpzIiwicHJvZHVjdC9wcm9kdWN0LnN0YXRlLmpzIiwicHJvZHVjdHMvcHJvZHVjdHMuanMiLCJzaWdudXAvc2lnbnVwLmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9GdWxsc3RhY2tQaWNzLmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9SYW5kb21HcmVldGluZ3MuanMiLCJjb21tb24vZGlyZWN0aXZlcy9mdWxsc3RhY2stbG9nby9mdWxsc3RhY2stbG9nby5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL25hdmJhci9uYXZiYXIuanMiLCJjb21tb24vZGlyZWN0aXZlcy9wYXN0dXJldG9wYW50cnktbG9nby9wdHAuanMiLCJjb21tb24vZGlyZWN0aXZlcy9yYW5kby1ncmVldGluZy9yYW5kby1ncmVldGluZy5qcyJdLCJuYW1lcyI6WyJ3aW5kb3ciLCJhcHAiLCJhbmd1bGFyIiwibW9kdWxlIiwiY29uZmlnIiwiJHVybFJvdXRlclByb3ZpZGVyIiwiJGxvY2F0aW9uUHJvdmlkZXIiLCJodG1sNU1vZGUiLCJvdGhlcndpc2UiLCJ3aGVuIiwibG9jYXRpb24iLCJyZWxvYWQiLCJydW4iLCIkcm9vdFNjb3BlIiwiQXV0aFNlcnZpY2UiLCIkc3RhdGUiLCJkZXN0aW5hdGlvblN0YXRlUmVxdWlyZXNBdXRoIiwic3RhdGUiLCJkYXRhIiwiYXV0aGVudGljYXRlIiwiJG9uIiwiZXZlbnQiLCJ0b1N0YXRlIiwidG9QYXJhbXMiLCJpc0F1dGhlbnRpY2F0ZWQiLCJwcmV2ZW50RGVmYXVsdCIsImdldExvZ2dlZEluVXNlciIsInRoZW4iLCJ1c2VyIiwiZ28iLCJuYW1lIiwiJHN0YXRlUHJvdmlkZXIiLCJ1cmwiLCJjb250cm9sbGVyIiwidGVtcGxhdGVVcmwiLCIkc2NvcGUiLCJGdWxsc3RhY2tQaWNzIiwiaW1hZ2VzIiwiXyIsInNodWZmbGUiLCJBZG1pbkZhY3RvcnkiLCJQcm9kdWN0cyIsImNhdGVnb3JpZXMiLCIkbG9nIiwiY2F0ZWdvcnlTZWxlY3Rpb24iLCJhZGRQcm9kdWN0IiwicHJvZHVjdCIsInNlbGVjdGVkQ2F0ZWdvcmllcyIsIk9iamVjdCIsImtleXMiLCJyZWR1Y2UiLCJhcnIiLCJvYmoiLCJpbmNsdWRlcyIsInR5cGVfbmFtZSIsInB1c2giLCJpZCIsImNhdGNoIiwiZXJyb3IiLCJmYWN0b3J5IiwiJGh0dHAiLCJwb3N0IiwicmVzcG9uc2UiLCJkZWxldGVQcm9kdWN0IiwiZGVsZXRlIiwicmVzb2x2ZSIsImdldEFsbENhdGVnb3JpZXMiLCJQcm9kdWN0RmFjdG9yeSIsIiRzZXNzaW9uU3RvcmFnZSIsInByb2R1Y3RzIiwiUmFuZ2UiLCJzdGFydCIsImVuZCIsInJlc3VsdCIsImkiLCJnZXRRdWFudGl0eSIsImNhcnQiLCJsZW5ndGgiLCJxdWFudGl0eSIsInRvdGFsIiwidG90YWxDb3N0IiwiZ2V0UHJvZHVjdCIsImluQ2FydCIsInByaWNlIiwiJCIsIiRmb3JtIiwic3VibWl0IiwiZmluZCIsInByb3AiLCJTdHJpcGUiLCJjYXJkIiwiY3JlYXRlVG9rZW4iLCJzdHJpcGVSZXNwb25zZUhhbmRsZXIiLCJzdGF0dXMiLCJ0ZXh0IiwibWVzc2FnZSIsInRva2VuIiwiYXBwZW5kIiwidmFsIiwiZ2V0IiwiRXJyb3IiLCJpbyIsIm9yaWdpbiIsImNvbnN0YW50IiwibG9naW5TdWNjZXNzIiwibG9naW5GYWlsZWQiLCJsb2dvdXRTdWNjZXNzIiwic2Vzc2lvblRpbWVvdXQiLCJub3RBdXRoZW50aWNhdGVkIiwibm90QXV0aG9yaXplZCIsIiRxIiwiQVVUSF9FVkVOVFMiLCJzdGF0dXNEaWN0IiwicmVzcG9uc2VFcnJvciIsIiRicm9hZGNhc3QiLCJyZWplY3QiLCIkaHR0cFByb3ZpZGVyIiwiaW50ZXJjZXB0b3JzIiwiJGluamVjdG9yIiwic2VydmljZSIsIlNlc3Npb24iLCJvblN1Y2Nlc3NmdWxMb2dpbiIsImNyZWF0ZSIsImZyb21TZXJ2ZXIiLCJzaWdudXAiLCJjcmVkZW50aWFscyIsImxvZ2luIiwibG9nb3V0IiwiZGVzdHJveSIsInNlbGYiLCJzZW5kTG9naW4iLCJsb2dpbkluZm8iLCJ0ZW1wbGF0ZSIsIlNlY3JldFN0YXNoIiwiZ2V0U3Rhc2giLCJzdGFzaCIsImFkZFRvQ2FydCIsImNvbnNvbGUiLCJsb2ciLCIkc3RhdGVQYXJhbXMiLCJmZXRjaEFsbCIsInByb2R1Y3RzQnlDYXRlZ29yeSIsImZldGNoQnlDYXRlZ29yeSIsInNlbmRTaWdudXAiLCJzaWdudXBJbmZvIiwiZ2V0UmFuZG9tRnJvbUFycmF5IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiZ3JlZXRpbmdzIiwiZ2V0UmFuZG9tR3JlZXRpbmciLCJkaXJlY3RpdmUiLCJyZXN0cmljdCIsInNjb3BlIiwibGluayIsIml0ZW1zIiwibGFiZWwiLCJhdXRoIiwiaXNMb2dnZWRJbiIsInNldFVzZXIiLCJyZW1vdmVVc2VyIiwiUmFuZG9tR3JlZXRpbmdzIiwiZ3JlZXRpbmciXSwibWFwcGluZ3MiOiJBQUFBOztBQUNBQSxPQUFBQyxHQUFBLEdBQUFDLFFBQUFDLE1BQUEsQ0FBQSx1QkFBQSxFQUFBLENBQUEsYUFBQSxFQUFBLFdBQUEsRUFBQSxjQUFBLEVBQUEsV0FBQSxFQUFBLFdBQUEsQ0FBQSxDQUFBOztBQUVBRixJQUFBRyxNQUFBLENBQUEsVUFBQUMsa0JBQUEsRUFBQUMsaUJBQUEsRUFBQTtBQUNBO0FBQ0FBLHNCQUFBQyxTQUFB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QUFBO0FBQ0FuSix1QkFBQU8sR0FBQSxDQUFBMkYsWUFBQUosY0FBQSxFQUFBcUQsVUFBQTtBQUVBOztBQTFDQSxLQUFBO0FBOENBLENBaERBOztBQ0FBL0osSUFBQXNKLFNBQUEsQ0FBQSxxQkFBQSxFQUFBLFlBQUE7QUFDQSxXQUFBO0FBQ0FDLGtCQUFBLEdBREE7QUFFQXRILHFCQUFBO0FBRkEsS0FBQTtBQUlBLENBTEE7O0FDQUFqQyxJQUFBc0osU0FBQSxDQUFBLGVBQUEsRUFBQSxVQUFBVSxlQUFBLEVBQUE7O0FBRUEsV0FBQTtBQUNBVCxrQkFBQSxHQURBO0FBRUF0SCxxQkFBQSx5REFGQTtBQUdBd0gsY0FBQSxjQUFBRCxLQUFBLEVBQUE7QUFDQUEsa0JBQUFTLFFBQUEsR0FBQUQsZ0JBQUFYLGlCQUFBLEVBQUE7QUFDQTtBQUxBLEtBQUE7QUFRQSxDQVZBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG53aW5kb3cuYXBwID0gYW5ndWxhci5tb2R1bGUoJ0Z1bGxzdGFja0dlbmVyYXRlZEFwcCcsIFsnZnNhUHJlQnVpbHQnLCAndWkucm91dGVyJywgJ3VpLmJvb3RzdHJhcCcsICduZ0FuaW1hdGUnLCAnbmdTdG9yYWdlJ10pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG4gICAgLy8gVGhpcyB0dXJucyBvZmYgaGFzaGJhbmcgdXJscyAoLyNhYm91dCkgYW5kIGNoYW5nZXMgaXQgdG8gc29tZXRoaW5nIG5vcm1hbCAoL2Fib3V0KVxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICAvLyBJZiB3ZSBnbyB0byBhIFVSTCB0aGF0IHVpLXJvdXRlciBkb2Vzbid0IGhhdmUgcmVnaXN0ZXJlZCwgZ28gdG8gdGhlIFwiL1wiIHVybC5cbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XG4gICAgLy8gVHJpZ2dlciBwYWdlIHJlZnJlc2ggd2hlbiBhY2Nlc3NpbmcgYW4gT0F1dGggcm91dGVcbiAgICAkdXJsUm91dGVyUHJvdmlkZXIud2hlbignL2F1dGgvOnByb3ZpZGVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfSk7XG59KTtcblxuLy8gVGhpcyBhcHAucnVuIGlzIGZvciBjb250cm9sbGluZyBhY2Nlc3MgdG8gc3BlY2lmaWMgc3RhdGVzLlxuYXBwLnJ1bihmdW5jdGlvbiAoJHJvb3RTY29wZSwgQXV0aFNlcnZpY2UsICRzdGF0ZSkge1xuXG4gICAgLy8gVGhlIGdpdmVuIHN0YXRlIHJlcXVpcmVzIGFuIGF1dGhlbnRpY2F0ZWQgdXNlci5cbiAgICB2YXIgZGVzdGluYXRpb25TdGF0ZVJlcXVpcmVzQXV0aCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgICByZXR1cm4gc3RhdGUuZGF0YSAmJiBzdGF0ZS5kYXRhLmF1dGhlbnRpY2F0ZTtcbiAgICB9O1xuXG4gICAgLy8gJHN0YXRlQ2hhbmdlU3RhcnQgaXMgYW4gZXZlbnQgZmlyZWRcbiAgICAvLyB3aGVuZXZlciB0aGUgcHJvY2VzcyBvZiBjaGFuZ2luZyBhIHN0YXRlIGJlZ2lucy5cbiAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zKSB7XG5cbiAgICAgICAgaWYgKCFkZXN0aW5hdGlvblN0YXRlUmVxdWlyZXNBdXRoKHRvU3RhdGUpKSB7XG4gICAgICAgICAgICAvLyBUaGUgZGVzdGluYXRpb24gc3RhdGUgZG9lcyBub3QgcmVxdWlyZSBhdXRoZW50aWNhdGlvblxuICAgICAgICAgICAgLy8gU2hvcnQgY2lyY3VpdCB3aXRoIHJldHVybi5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuICAgICAgICAgICAgLy8gVGhlIHVzZXIgaXMgYXV0aGVudGljYXRlZC5cbiAgICAgICAgICAgIC8vIFNob3J0IGNpcmN1aXQgd2l0aCByZXR1cm4uXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDYW5jZWwgbmF2aWdhdGluZyB0byBuZXcgc3RhdGUuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgQXV0aFNlcnZpY2UuZ2V0TG9nZ2VkSW5Vc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICAgICAgLy8gSWYgYSB1c2VyIGlzIHJldHJpZXZlZCwgdGhlbiByZW5hdmlnYXRlIHRvIHRoZSBkZXN0aW5hdGlvblxuICAgICAgICAgICAgLy8gKHRoZSBzZWNvbmQgdGltZSwgQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkgd2lsbCB3b3JrKVxuICAgICAgICAgICAgLy8gb3RoZXJ3aXNlLCBpZiBubyB1c2VyIGlzIGxvZ2dlZCBpbiwgZ28gdG8gXCJsb2dpblwiIHN0YXRlLlxuICAgICAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28odG9TdGF0ZS5uYW1lLCB0b1BhcmFtcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgLy8gUmVnaXN0ZXIgb3VyICphYm91dCogc3RhdGUuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2Fib3V0Jywge1xuICAgICAgICB1cmw6ICcvYWJvdXQnLFxuICAgICAgICBjb250cm9sbGVyOiAnQWJvdXRDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9hYm91dC9hYm91dC5odG1sJ1xuICAgIH0pO1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0Fib3V0Q29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIEZ1bGxzdGFja1BpY3MpIHtcblxuICAgIC8vIEltYWdlcyBvZiBiZWF1dGlmdWwgRnVsbHN0YWNrIHBlb3BsZS5cbiAgICAkc2NvcGUuaW1hZ2VzID0gXy5zaHVmZmxlKEZ1bGxzdGFja1BpY3MpO1xuXG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuYXBwLmNvbnRyb2xsZXIoJ0FkbWluQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCBBZG1pbkZhY3RvcnksIFByb2R1Y3RzLCBjYXRlZ29yaWVzLCAkbG9nKSB7XG4gICRzY29wZS5jYXRlZ29yeVNlbGVjdGlvbiA9IHt9O1xuICAkc2NvcGUuY2F0ZWdvcmllcyA9IGNhdGVnb3JpZXM7XG5cblxuICAkc2NvcGUuYWRkUHJvZHVjdCA9IGZ1bmN0aW9uKHByb2R1Y3QpIHtcbiAgICBsZXQgc2VsZWN0ZWRDYXRlZ29yaWVzID0gT2JqZWN0LmtleXMoJHNjb3BlLmNhdGVnb3J5U2VsZWN0aW9uKTtcbiAgICBsZXQgY2F0ZWdvcmllcyA9ICRzY29wZS5jYXRlZ29yaWVzLnJlZHVjZShmdW5jdGlvbihhcnIsIG9iaikge1xuICAgICAgaWYgKHNlbGVjdGVkQ2F0ZWdvcmllcy5pbmNsdWRlcyhvYmoudHlwZV9uYW1lKSkgYXJyLnB1c2gob2JqLmlkKTtcbiAgICAgIHJldHVybiBhcnI7XG4gICAgfSwgW10pO1xuICAgIEFkbWluRmFjdG9yeS5hZGRQcm9kdWN0KHtwcm9kdWN0OnByb2R1Y3QsIGNhdGVnb3JpZXM6IGNhdGVnb3JpZXN9KVxuICAgIC50aGVuKGZ1bmN0aW9uKHByb2R1Y3QpIHtcbiAgICAgICRzdGF0ZS5nbygncHJvZHVjdCcsIHsgaWQ6IHByb2R1Y3QuaWQgfSk7XG4gICAgfSlcbiAgICAuY2F0Y2goJGxvZy5lcnJvcik7XG4gIH1cblxufSlcbiIsIid1c2Ugc3RyaWN0JztcblxuYXBwLmZhY3RvcnkoJ0FkbWluRmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwKSB7XG4gIHJldHVybiB7XG4gICAgLy9wcm9kdWN0IGlzIGZyb20gY29udHJvbGxlciBzY29wZSBhZGRlZCBieSBuZy1tb2RlbCBpbiBmb3JtIC0+IHByb2R1Y3Qgb2JqXG4gICAgYWRkUHJvZHVjdDogZnVuY3Rpb24ocHJvZHVjdCkge1xuICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvcHJvZHVjdHMnLCBwcm9kdWN0KVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBkZWxldGVQcm9kdWN0OiBmdW5jdGlvbihpZCkge1xuICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZSgnL2FwaS9wcm9kdWN0cy8nICsgaWQpXG4gICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhZGRQcm9kdWN0Jywge1xuICAgICAgICB1cmw6ICcvcHJvZHVjdHMvYWRkJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9hZG1pbi9hZGQtcHJvZHVjdC5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0FkbWluQ3RybCcsXG4gICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICBjYXRlZ29yaWVzOiBmdW5jdGlvbihQcm9kdWN0cykge1xuICAgICAgICAgICAgcmV0dXJuIFByb2R1Y3RzLmdldEFsbENhdGVnb3JpZXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuIiwiICd1c2Ugc3RyaWN0JztcbmFwcC5jb250cm9sbGVyKCdDYXJ0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgUHJvZHVjdEZhY3RvcnksICRzZXNzaW9uU3RvcmFnZSwgcHJvZHVjdHMpIHtcblxuICAgICRzY29wZS5wcm9kdWN0cyA9IHByb2R1Y3RzO1xuXG4gICAgJHNjb3BlLlJhbmdlID0gZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSBzdGFydDsgaSA8PSBlbmQ7IGkrKykge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmdldFF1YW50aXR5ID0gZnVuY3Rpb24oaWQpe1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgJHNlc3Npb25TdG9yYWdlLmNhcnQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICgkc2Vzc2lvblN0b3JhZ2UuY2FydFtpXS5pZCA9PT0gaWQpIHJldHVybiAkc2Vzc2lvblN0b3JhZ2UuY2FydFtpXS5xdWFudGl0eTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkc2NvcGUudG90YWwgPSBmdW5jdGlvbigpIHtcbiAgICAgIGxldCB0b3RhbCA9IDA7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgJHNjb3BlLnByb2R1Y3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRvdGFsICs9ICRzY29wZS5wcm9kdWN0c1tpXS50b3RhbENvc3Q7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0b3RhbDtcbiAgICB9O1xuXG59KTtcblxuXG5hcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2NhcnQnLCB7XG4gICAgICAgIHVybDogJy9jYXJ0JyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jYXJ0L2NhcnQuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdDYXJ0Q3RybCcsXG4gICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgIHByb2R1Y3RzOiBmdW5jdGlvbigkc2Vzc2lvblN0b3JhZ2UsIFByb2R1Y3RGYWN0b3J5KSB7XG4gICAgICAgICAgICAgICAgbGV0IHByb2R1Y3RzID0gW107XG4gICAgICAgICAgICAgICAgaWYgKCRzZXNzaW9uU3RvcmFnZS5jYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNlc3Npb25TdG9yYWdlLmNhcnQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFByb2R1Y3RGYWN0b3J5LmdldFByb2R1Y3QoJHNlc3Npb25TdG9yYWdlLmNhcnRbaV0uaWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocHJvZHVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb2R1Y3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvZHVjdHNbaV0uaWQgPT09IHByb2R1Y3QuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5DYXJ0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWluQ2FydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZHVjdHMucHVzaChwcm9kdWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9kdWN0cztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2NoZWNrb3V0Jywge1xuICAgICAgICB1cmw6ICcvY2hlY2tvdXQnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NoZWNrb3V0L2NoZWNrb3V0Lmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnQ2FydEN0cmwnLFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICBwcm9kdWN0czogZnVuY3Rpb24oJHNlc3Npb25TdG9yYWdlLCBQcm9kdWN0RmFjdG9yeSkge1xuICAgICAgICAgICAgICAgIGxldCBwcm9kdWN0cyA9IFtdO1xuICAgICAgICAgICAgICAgIGlmICgkc2Vzc2lvblN0b3JhZ2UuY2FydCkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzZXNzaW9uU3RvcmFnZS5jYXJ0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBQcm9kdWN0RmFjdG9yeS5nZXRQcm9kdWN0KCRzZXNzaW9uU3RvcmFnZS5jYXJ0W2ldLmlkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHByb2R1Y3QpIHtcblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvZHVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9kdWN0c1tpXS5pZCA9PT0gcHJvZHVjdC5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbkNhcnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaW5DYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9kdWN0LnRvdGFsQ29zdCA9ICRzZXNzaW9uU3RvcmFnZS5jYXJ0W2ldLnF1YW50aXR5ICogcHJvZHVjdC5wcmljZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2R1Y3RzLnB1c2gocHJvZHVjdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvZHVjdHM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuIiwiJChmdW5jdGlvbigpIHtcbiAgdmFyICRmb3JtID0gJCgnI3BheW1lbnQtZm9ybScpO1xuICAkZm9ybS5zdWJtaXQoZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAvLyBEaXNhYmxlIHRoZSBzdWJtaXQgYnV0dG9uIHRvIHByZXZlbnQgcmVwZWF0ZWQgY2xpY2tzOlxuICAgICRmb3JtLmZpbmQoJy5zdWJtaXQnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgIC8vIFJlcXVlc3QgYSB0b2tlbiBmcm9tIFN0cmlwZTpcbiAgICBTdHJpcGUuY2FyZC5jcmVhdGVUb2tlbigkZm9ybSwgc3RyaXBlUmVzcG9uc2VIYW5kbGVyKTtcbiAgICAvLyBQcmV2ZW50IHRoZSBmb3JtIGZyb20gYmVpbmcgc3VibWl0dGVkOlxuICAgIHJldHVybiBmYWxzZTtcbiAgfSk7XG59KTtcblxuZnVuY3Rpb24gc3RyaXBlUmVzcG9uc2VIYW5kbGVyKHN0YXR1cywgcmVzcG9uc2UpIHtcbiAgLy8gR3JhYiB0aGUgZm9ybTpcbiAgdmFyICRmb3JtID0gJCgnI3BheW1lbnQtZm9ybScpO1xuICBpZiAocmVzcG9uc2UuZXJyb3IpIHsgLy8gUHJvYmxlbSFcbiAgICAvLyBTaG93IHRoZSBlcnJvcnMgb24gdGhlIGZvcm06XG4gICAgJGZvcm0uZmluZCgnLnBheW1lbnQtZXJyb3JzJykudGV4dChyZXNwb25zZS5lcnJvci5tZXNzYWdlKTtcbiAgICAkZm9ybS5maW5kKCcuc3VibWl0JykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7IC8vIFJlLWVuYWJsZSBzdWJtaXNzaW9uXG4gIH0gZWxzZSB7IC8vIFRva2VuIHdhcyBjcmVhdGVkIVxuICAgIC8vIEdldCB0aGUgdG9rZW4gSUQ6XG4gICAgdmFyIHRva2VuID0gcmVzcG9uc2UuaWQ7XG4gICAgLy8gSW5zZXJ0IHRoZSB0b2tlbiBJRCBpbnRvIHRoZSBmb3JtIHNvIGl0IGdldHMgc3VibWl0dGVkIHRvIHRoZSBzZXJ2ZXI6XG4gICAgJGZvcm0uYXBwZW5kKCQoJzxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cInN0cmlwZVRva2VuXCI+JykudmFsKHRva2VuKSk7XG4gICAgLy8gU3VibWl0IHRoZSBmb3JtOlxuICAgICRmb3JtLmdldCgwKS5zdWJtaXQoKTtcbiAgfVxufVxuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnZG9jcycsIHtcbiAgICAgICAgdXJsOiAnL2RvY3MnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2RvY3MvZG9jcy5odG1sJ1xuICAgIH0pO1xufSk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8gSG9wZSB5b3UgZGlkbid0IGZvcmdldCBBbmd1bGFyISBEdWgtZG95LlxuICAgIGlmICghd2luZG93LmFuZ3VsYXIpIHRocm93IG5ldyBFcnJvcignSSBjYW5cXCd0IGZpbmQgQW5ndWxhciEnKTtcblxuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnZnNhUHJlQnVpbHQnLCBbXSk7XG5cbiAgICBhcHAuZmFjdG9yeSgnU29ja2V0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXdpbmRvdy5pbykgdGhyb3cgbmV3IEVycm9yKCdzb2NrZXQuaW8gbm90IGZvdW5kIScpO1xuICAgICAgICByZXR1cm4gd2luZG93LmlvKHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pO1xuICAgIH0pO1xuXG4gICAgLy8gQVVUSF9FVkVOVFMgaXMgdXNlZCB0aHJvdWdob3V0IG91ciBhcHAgdG9cbiAgICAvLyBicm9hZGNhc3QgYW5kIGxpc3RlbiBmcm9tIGFuZCB0byB0aGUgJHJvb3RTY29wZVxuICAgIC8vIGZvciBpbXBvcnRhbnQgZXZlbnRzIGFib3V0IGF1dGhlbnRpY2F0aW9uIGZsb3cuXG4gICAgYXBwLmNvbnN0YW50KCdBVVRIX0VWRU5UUycsIHtcbiAgICAgICAgbG9naW5TdWNjZXNzOiAnYXV0aC1sb2dpbi1zdWNjZXNzJyxcbiAgICAgICAgbG9naW5GYWlsZWQ6ICdhdXRoLWxvZ2luLWZhaWxlZCcsXG4gICAgICAgIGxvZ291dFN1Y2Nlc3M6ICdhdXRoLWxvZ291dC1zdWNjZXNzJyxcbiAgICAgICAgc2Vzc2lvblRpbWVvdXQ6ICdhdXRoLXNlc3Npb24tdGltZW91dCcsXG4gICAgICAgIG5vdEF1dGhlbnRpY2F0ZWQ6ICdhdXRoLW5vdC1hdXRoZW50aWNhdGVkJyxcbiAgICAgICAgbm90QXV0aG9yaXplZDogJ2F1dGgtbm90LWF1dGhvcml6ZWQnXG4gICAgfSk7XG5cbiAgICBhcHAuZmFjdG9yeSgnQXV0aEludGVyY2VwdG9yJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRxLCBBVVRIX0VWRU5UUykge1xuICAgICAgICB2YXIgc3RhdHVzRGljdCA9IHtcbiAgICAgICAgICAgIDQwMTogQVVUSF9FVkVOVFMubm90QXV0aGVudGljYXRlZCxcbiAgICAgICAgICAgIDQwMzogQVVUSF9FVkVOVFMubm90QXV0aG9yaXplZCxcbiAgICAgICAgICAgIDQxOTogQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXQsXG4gICAgICAgICAgICA0NDA6IEFVVEhfRVZFTlRTLnNlc3Npb25UaW1lb3V0XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXNwb25zZUVycm9yOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3Qoc3RhdHVzRGljdFtyZXNwb25zZS5zdGF0dXNdLCByZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChyZXNwb25zZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIGFwcC5jb25maWcoZnVuY3Rpb24gKCRodHRwUHJvdmlkZXIpIHtcbiAgICAgICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaChbXG4gICAgICAgICAgICAnJGluamVjdG9yJyxcbiAgICAgICAgICAgIGZ1bmN0aW9uICgkaW5qZWN0b3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJGluamVjdG9yLmdldCgnQXV0aEludGVyY2VwdG9yJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgYXBwLnNlcnZpY2UoJ0F1dGhTZXJ2aWNlJywgZnVuY3Rpb24gKCRodHRwLCBTZXNzaW9uLCAkcm9vdFNjb3BlLCBBVVRIX0VWRU5UUywgJHEpIHtcblxuICAgICAgICBmdW5jdGlvbiBvblN1Y2Nlc3NmdWxMb2dpbihyZXNwb25zZSkge1xuICAgICAgICAgICAgdmFyIHVzZXIgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgU2Vzc2lvbi5jcmVhdGUodXNlcik7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoQVVUSF9FVkVOVFMubG9naW5TdWNjZXNzKTtcbiAgICAgICAgICAgIHJldHVybiB1c2VyO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVXNlcyB0aGUgc2Vzc2lvbiBmYWN0b3J5IHRvIHNlZSBpZiBhblxuICAgICAgICAvLyBhdXRoZW50aWNhdGVkIHVzZXIgaXMgY3VycmVudGx5IHJlZ2lzdGVyZWQuXG4gICAgICAgIHRoaXMuaXNBdXRoZW50aWNhdGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICEhU2Vzc2lvbi51c2VyO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZ2V0TG9nZ2VkSW5Vc2VyID0gZnVuY3Rpb24gKGZyb21TZXJ2ZXIpIHtcblxuICAgICAgICAgICAgLy8gSWYgYW4gYXV0aGVudGljYXRlZCBzZXNzaW9uIGV4aXN0cywgd2VcbiAgICAgICAgICAgIC8vIHJldHVybiB0aGUgdXNlciBhdHRhY2hlZCB0byB0aGF0IHNlc3Npb25cbiAgICAgICAgICAgIC8vIHdpdGggYSBwcm9taXNlLiBUaGlzIGVuc3VyZXMgdGhhdCB3ZSBjYW5cbiAgICAgICAgICAgIC8vIGFsd2F5cyBpbnRlcmZhY2Ugd2l0aCB0aGlzIG1ldGhvZCBhc3luY2hyb25vdXNseS5cblxuICAgICAgICAgICAgLy8gT3B0aW9uYWxseSwgaWYgdHJ1ZSBpcyBnaXZlbiBhcyB0aGUgZnJvbVNlcnZlciBwYXJhbWV0ZXIsXG4gICAgICAgICAgICAvLyB0aGVuIHRoaXMgY2FjaGVkIHZhbHVlIHdpbGwgbm90IGJlIHVzZWQuXG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzQXV0aGVudGljYXRlZCgpICYmIGZyb21TZXJ2ZXIgIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEud2hlbihTZXNzaW9uLnVzZXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBNYWtlIHJlcXVlc3QgR0VUIC9zZXNzaW9uLlxuICAgICAgICAgICAgLy8gSWYgaXQgcmV0dXJucyBhIHVzZXIsIGNhbGwgb25TdWNjZXNzZnVsTG9naW4gd2l0aCB0aGUgcmVzcG9uc2UuXG4gICAgICAgICAgICAvLyBJZiBpdCByZXR1cm5zIGEgNDAxIHJlc3BvbnNlLCB3ZSBjYXRjaCBpdCBhbmQgaW5zdGVhZCByZXNvbHZlIHRvIG51bGwuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvc2Vzc2lvbicpLnRoZW4ob25TdWNjZXNzZnVsTG9naW4pLmNhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5zaWdudXAgPSBmdW5jdGlvbihjcmVkZW50aWFscykge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvc2lnbnVwJywgY3JlZGVudGlhbHMpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihvblN1Y2Nlc3NmdWxMb2dpbilcbiAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QoeyBtZXNzYWdlOiAnU2lnbnVwIHVuc3VjY2Vzc2Z1bC4nIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5sb2dpbiA9IGZ1bmN0aW9uIChjcmVkZW50aWFscykge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvbG9naW4nLCBjcmVkZW50aWFscylcbiAgICAgICAgICAgICAgICAudGhlbihvblN1Y2Nlc3NmdWxMb2dpbilcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHsgbWVzc2FnZTogJ0ludmFsaWQgbG9naW4gY3JlZGVudGlhbHMuJyB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2xvZ291dCcpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIFNlc3Npb24uZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChBVVRIX0VWRU5UUy5sb2dvdXRTdWNjZXNzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbiAgICBhcHAuc2VydmljZSgnU2Vzc2lvbicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCBBVVRIX0VWRU5UUykge1xuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbihBVVRIX0VWRU5UUy5ub3RBdXRoZW50aWNhdGVkLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzZWxmLmRlc3Ryb3koKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNlbGYuZGVzdHJveSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnVzZXIgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgICAgIHRoaXMudXNlciA9IHVzZXI7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy51c2VyID0gbnVsbDtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG59KCkpO1xuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnaG9tZScsIHtcbiAgICAgICAgdXJsOiAnLycsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvaG9tZS9ob21lLmh0bWwnXG4gICAgfSk7XG59KTtcbiIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbG9naW4nLCB7XG4gICAgICAgIHVybDogJy9sb2dpbicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvbG9naW4vbG9naW4uaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignTG9naW5DdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgQXV0aFNlcnZpY2UsICRzdGF0ZSkge1xuXG4gICAgJHNjb3BlLmxvZ2luID0ge307XG4gICAgJHNjb3BlLmVycm9yID0gbnVsbDtcblxuICAgICRzY29wZS5zZW5kTG9naW4gPSBmdW5jdGlvbiAobG9naW5JbmZvKSB7XG5cbiAgICAgICAgJHNjb3BlLmVycm9yID0gbnVsbDtcblxuICAgICAgICBBdXRoU2VydmljZS5sb2dpbihsb2dpbkluZm8pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9ICdJbnZhbGlkIGxvZ2luIGNyZWRlbnRpYWxzLic7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ21lbWJlcnNPbmx5Jywge1xuICAgICAgICB1cmw6ICcvbWVtYmVycy1hcmVhJyxcbiAgICAgICAgdGVtcGxhdGU6ICc8aW1nIG5nLXJlcGVhdD1cIml0ZW0gaW4gc3Rhc2hcIiB3aWR0aD1cIjMwMFwiIG5nLXNyYz1cInt7IGl0ZW0gfX1cIiAvPicsXG4gICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgkc2NvcGUsIFNlY3JldFN0YXNoKSB7XG4gICAgICAgICAgICBTZWNyZXRTdGFzaC5nZXRTdGFzaCgpLnRoZW4oZnVuY3Rpb24gKHN0YXNoKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnN0YXNoID0gc3Rhc2g7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBkYXRhLmF1dGhlbnRpY2F0ZSBpcyByZWFkIGJ5IGFuIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgIC8vIHRoYXQgY29udHJvbHMgYWNjZXNzIHRvIHRoaXMgc3RhdGUuIFJlZmVyIHRvIGFwcC5qcy5cbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgYXV0aGVudGljYXRlOiB0cnVlXG4gICAgICAgIH1cbiAgICB9KTtcblxufSk7XG5cbmFwcC5mYWN0b3J5KCdTZWNyZXRTdGFzaCcsIGZ1bmN0aW9uICgkaHR0cCkge1xuXG4gICAgdmFyIGdldFN0YXNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL21lbWJlcnMvc2VjcmV0LXN0YXNoJykudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0U3Rhc2g6IGdldFN0YXNoXG4gICAgfTtcblxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmFwcC5jb250cm9sbGVyKCdQcm9kdWN0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgUHJvZHVjdEZhY3RvcnksICRsb2csICRzZXNzaW9uU3RvcmFnZSwgcHJvZHVjdCkge1xuICAgICRzY29wZS5wcm9kdWN0ID0gcHJvZHVjdDtcblxuICAgICRzY29wZS5SYW5nZSA9IGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPD0gZW5kOyBpKyspIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIGlmICghJHNlc3Npb25TdG9yYWdlLmNhcnQpIHtcbiAgICAgICAgJHNlc3Npb25TdG9yYWdlLmNhcnQgPSBbXTtcbiAgICB9XG5cbiAgICAkc2NvcGUuYWRkVG9DYXJ0ID0gZnVuY3Rpb24oaWQsIHF1YW50aXR5KSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNlc3Npb25TdG9yYWdlLmNhcnQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICgkc2Vzc2lvblN0b3JhZ2UuY2FydFtpXS5pZCA9PT0gaWQpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5DYXJ0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAkc2Vzc2lvblN0b3JhZ2UuY2FydFtpXS5xdWFudGl0eSArPSBxdWFudGl0eTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaW5DYXJ0KSB7XG4gICAgICAgICAgICAkc2Vzc2lvblN0b3JhZ2UuY2FydC5wdXNoKHsgaWQ6IGlkLCBxdWFudGl0eTogcXVhbnRpdHkgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZygkc2Vzc2lvblN0b3JhZ2UuY2FydCk7XG4gICAgfTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5hcHAuZmFjdG9yeSgnUHJvZHVjdEZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCkge1xuICByZXR1cm4ge1xuICAgIGdldFByb2R1Y3Q6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3Byb2R1Y3RzL2l0ZW0vJyArIGlkKVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBhZGRUb0NhcnQ6IGZ1bmN0aW9uKGlkLCBxdWFudGl0eSkge1xuICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9wcm9kdWN0cy9pdGVtLycgKyBpZClcbiAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgIH0pXG4gICAgfVxuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgncHJvZHVjdCcsIHtcbiAgICAgICAgdXJsOiAnL3Byb2R1Y3RzLzppZCcsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvcHJvZHVjdC9wcm9kdWN0Lmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnUHJvZHVjdEN0cmwnLFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgcHJvZHVjdDogZnVuY3Rpb24oUHJvZHVjdEZhY3RvcnksICRzdGF0ZVBhcmFtcykge1xuICAgICAgICAgICAgcmV0dXJuIFByb2R1Y3RGYWN0b3J5LmdldFByb2R1Y3QoJHN0YXRlUGFyYW1zLmlkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgncHJvZHVjdHMnLCB7XG4gICAgICAgIHVybDogJy9wcm9kdWN0cycsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvcHJvZHVjdHMvcHJvZHVjdHMuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSwgUHJvZHVjdHMpe1xuICAgICAgICAgICAgUHJvZHVjdHMuZmV0Y2hBbGwoKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgICRzY29wZS5wcm9kdWN0cyA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIFByb2R1Y3RzLmdldEFsbENhdGVnb3JpZXMoKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgICRzY29wZS5jYXRlZ29yaWVzID0gcmVzcG9uc2U7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHNjb3BlLnByb2R1Y3RzQnlDYXRlZ29yeSA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgICAgICAgICBQcm9kdWN0cy5mZXRjaEJ5Q2F0ZWdvcnkoaWQpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJvZHVjdHMgPSByZXNwb25zZTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59KTtcblxuYXBwLmZhY3RvcnkoJ1Byb2R1Y3RzJywgZnVuY3Rpb24oJGh0dHAsICRsb2cpe1xuICAgIHJldHVybiB7XG4gICAgICAgIGZldGNoQWxsOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9wcm9kdWN0cy8nKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgkbG9nLmVycm9yKVxuICAgICAgICB9LFxuXG4gICAgICAgIGdldEFsbENhdGVnb3JpZXM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3Byb2R1Y3RzL2FsbGNhdGVnb3JpZXMnKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgkbG9nLmVycm9yKVxuICAgICAgICB9LFxuXG4gICAgICAgIGZldGNoQnlDYXRlZ29yeTogZnVuY3Rpb24oaWQpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9wcm9kdWN0cy9jYXRlZ29yaWVzLycgKyBpZClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goJGxvZy5lcnJvcilcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdzaWdudXAnLCB7XG4gICAgICAgdXJsOiAnL3NpZ251cCcsXG4gICAgICAgdGVtcGxhdGVVcmw6ICdqcy9zaWdudXAvc2lnbnVwLmh0bWwnLFxuICAgICAgIGNvbnRyb2xsZXI6ICdTaWdudXBDdHJsJ1xuICAgIH0pO1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1NpZ251cEN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBBdXRoU2VydmljZSwgJHN0YXRlKSB7XG5cbiAgICAkc2NvcGUuc2lnbnVwID0ge307XG4gICAgJHNjb3BlLmVycm9yID0gbnVsbDtcblxuICAgICRzY29wZS5zZW5kU2lnbnVwID0gZnVuY3Rpb24gKHNpZ251cEluZm8pIHtcblxuICAgICAgICAkc2NvcGUuZXJyb3IgPSBudWxsO1xuXG4gICAgICAgIEF1dGhTZXJ2aWNlLnNpZ251cChzaWdudXBJbmZvKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnaG9tZScpO1xuICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSAnVGhpcyBlbWFpbCBpcyBpbnZhbGlkIE9SIGVtYWlsIGFscmVhZHkgZXhpc3RzLic7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxufSk7XG4iLCJhcHAuZmFjdG9yeSgnRnVsbHN0YWNrUGljcycsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gW1xuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I3Z0JYdWxDQUFBWFFjRS5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9mYmNkbi1zcGhvdG9zLWMtYS5ha2FtYWloZC5uZXQvaHBob3Rvcy1hay14YXAxL3QzMS4wLTgvMTA4NjI0NTFfMTAyMDU2MjI5OTAzNTkyNDFfODAyNzE2ODg0MzMxMjg0MTEzN19vLmpwZycsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQi1MS1VzaElnQUV5OVNLLmpwZycsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjc5LVg3b0NNQUFrdzd5LmpwZycsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQi1VajlDT0lJQUlGQWgwLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjZ5SXlGaUNFQUFxbDEyLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0UtVDc1bFdBQUFtcXFKLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0V2WkFnLVZBQUFrOTMyLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0VnTk1lT1hJQUlmRGhLLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0VReUlETldnQUF1NjBCLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0NGM1Q1UVc4QUUybEdKLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0FlVnc1U1dvQUFBTHNqLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0FhSklQN1VrQUFsSUdzLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0FRT3c5bFdFQUFZOUZsLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQi1PUWJWckNNQUFOd0lNLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjliX2Vyd0NZQUF3UmNKLnBuZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjVQVGR2bkNjQUVBbDR4LmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjRxd0MwaUNZQUFsUEdoLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjJiMzN2UklVQUE5bzFELmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQndwSXdyMUlVQUF2TzJfLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQnNTc2VBTkNZQUVPaEx3LmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0o0dkxmdVV3QUFkYTRMLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0k3d3pqRVZFQUFPUHBTLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0lkSHZUMlVzQUFubkhWLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0dDaVBfWVdZQUFvNzVWLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0lTNEpQSVdJQUkzN3F1LmpwZzpsYXJnZSdcbiAgICBdO1xufSk7XG4iLCJhcHAuZmFjdG9yeSgnUmFuZG9tR3JlZXRpbmdzJywgZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIGdldFJhbmRvbUZyb21BcnJheSA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgICAgICAgcmV0dXJuIGFycltNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhcnIubGVuZ3RoKV07XG4gICAgfTtcblxuICAgIHZhciBncmVldGluZ3MgPSBbXG4gICAgICAgICdIZWxsbywgd29ybGQhJyxcbiAgICAgICAgJ0F0IGxvbmcgbGFzdCwgSSBsaXZlIScsXG4gICAgICAgICdIZWxsbywgc2ltcGxlIGh1bWFuLicsXG4gICAgICAgICdXaGF0IGEgYmVhdXRpZnVsIGRheSEnLFxuICAgICAgICAnSVxcJ20gbGlrZSBhbnkgb3RoZXIgcHJvamVjdCwgZXhjZXB0IHRoYXQgSSBhbSB5b3Vycy4gOiknLFxuICAgICAgICAnVGhpcyBlbXB0eSBzdHJpbmcgaXMgZm9yIExpbmRzYXkgTGV2aW5lLicsXG4gICAgICAgICfjgZPjgpPjgavjgaHjga/jgIHjg6bjg7zjgrbjg7zmp5jjgIInLFxuICAgICAgICAnV2VsY29tZS4gVG8uIFdFQlNJVEUuJyxcbiAgICAgICAgJzpEJyxcbiAgICAgICAgJ1llcywgSSB0aGluayB3ZVxcJ3ZlIG1ldCBiZWZvcmUuJyxcbiAgICAgICAgJ0dpbW1lIDMgbWlucy4uLiBJIGp1c3QgZ3JhYmJlZCB0aGlzIHJlYWxseSBkb3BlIGZyaXR0YXRhJyxcbiAgICAgICAgJ0lmIENvb3BlciBjb3VsZCBvZmZlciBvbmx5IG9uZSBwaWVjZSBvZiBhZHZpY2UsIGl0IHdvdWxkIGJlIHRvIG5ldlNRVUlSUkVMIScsXG4gICAgXTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGdyZWV0aW5nczogZ3JlZXRpbmdzLFxuICAgICAgICBnZXRSYW5kb21HcmVldGluZzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGdldFJhbmRvbUZyb21BcnJheShncmVldGluZ3MpO1xuICAgICAgICB9XG4gICAgfTtcblxufSk7XG4iLCJhcHAuZGlyZWN0aXZlKCdmdWxsc3RhY2tMb2dvJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvZnVsbHN0YWNrLWxvZ28vZnVsbHN0YWNrLWxvZ28uaHRtbCdcbiAgICB9O1xufSk7XG4iLCJhcHAuZGlyZWN0aXZlKCduYXZiYXInLCBmdW5jdGlvbigkcm9vdFNjb3BlLCBBdXRoU2VydmljZSwgQVVUSF9FVkVOVFMsICRzdGF0ZSkge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IHt9LFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9kaXJlY3RpdmVzL25hdmJhci9uYXZiYXIuaHRtbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlKSB7XG5cbiAgICAgICAgICAgIHNjb3BlLml0ZW1zID0gW1xuICAgICAgICAgICAgICAgIHsgbGFiZWw6ICdQcm9kdWN0cycsIHN0YXRlOiAncHJvZHVjdHMnIH0sXG4gICAgICAgICAgICAgICAgeyBsYWJlbDogJ0hvbWUnLCBzdGF0ZTogJ2hvbWUnIH0sXG4gICAgICAgICAgICAgICAgeyBsYWJlbDogJ0Fib3V0Jywgc3RhdGU6ICdhYm91dCcgfSxcbiAgICAgICAgICAgICAgICB7IGxhYmVsOiAnRG9jdW1lbnRhdGlvbicsIHN0YXRlOiAnZG9jcycgfSxcbiAgICAgICAgICAgICAgICB7IGxhYmVsOiAnTWVtYmVycyBPbmx5Jywgc3RhdGU6ICdtZW1iZXJzT25seScsIGF1dGg6IHRydWUgfVxuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgc2NvcGUudXNlciA9IG51bGw7XG5cbiAgICAgICAgICAgIHNjb3BlLmlzTG9nZ2VkSW4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBzY29wZS5sb2dvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBBdXRoU2VydmljZS5sb2dvdXQoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBzZXRVc2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgQXV0aFNlcnZpY2UuZ2V0TG9nZ2VkSW5Vc2VyKCkudGhlbihmdW5jdGlvbih1c2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnVzZXIgPSB1c2VyO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIHJlbW92ZVVzZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzY29wZS51c2VyID0gbnVsbDtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHNldFVzZXIoKTtcblxuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMubG9naW5TdWNjZXNzLCBzZXRVc2VyKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJG9uKEFVVEhfRVZFTlRTLmxvZ291dFN1Y2Nlc3MsIHJlbW92ZVVzZXIpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXQsIHJlbW92ZVVzZXIpO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbn0pO1xuIiwiYXBwLmRpcmVjdGl2ZSgncGFzdHVyZVRvUGFudHJ5TG9nbycsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9kaXJlY3RpdmVzL3Bhc3R1cmV0b3BhbnRyeS1sb2dvL3B0cC5odG1sJ1xuICAgIH07XG59KTtcbiIsImFwcC5kaXJlY3RpdmUoJ3JhbmRvR3JlZXRpbmcnLCBmdW5jdGlvbiAoUmFuZG9tR3JlZXRpbmdzKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9kaXJlY3RpdmVzL3JhbmRvLWdyZWV0aW5nL3JhbmRvLWdyZWV0aW5nLmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUpIHtcbiAgICAgICAgICAgIHNjb3BlLmdyZWV0aW5nID0gUmFuZG9tR3JlZXRpbmdzLmdldFJhbmRvbUdyZWV0aW5nKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
