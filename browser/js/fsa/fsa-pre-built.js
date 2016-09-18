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
            responseError: function (response) {
                $rootScope.$broadcast(statusDict[response.status], response);
                return $q.reject(response)
            }
        };
    });

    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push([
            '$injector',
            function ($injector) {
                return $injector.get('AuthInterceptor');
            }
        ]);
    });

    app.service('AuthService', function ($http, Session, $rootScope, AUTH_EVENTS, $q, $sessionStorage, CartFactory) {
        function onSuccessfulLogin(response) {
            var user = response.data;
            Session.create(user);
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);

            //merge items into the cart
            if (!$sessionStorage.cart) $sessionStorage.cart = [];
            console.log('SESSIONSTORAGECART AT BEGINNING OF LOGIN PROCESS', $sessionStorage.cart);

            if ($sessionStorage.cart.length){
                 CartFactory.mergeMyCart(user.id, {updates: $sessionStorage.cart})
                 .then(function(){
                    console.log('LOGIN INITIATED MERGE');
                    return CartFactory.fetchMyCart(user.id);
                 })
                 .then(function(result){
                    //we only need item quantity and productID on storagesessions
                    //when we build the cart we fetch the product by id anyway
                    $sessionStorage.cart = result.items.map(function(cartItem){ return {id: cartItem.productId, quantity: cartItem.quantity}});
                    console.log('SESSIONSTORAGECART AT END OF LOGIN PROCESS', $sessionStorage.cart);
                      return user;
                 });
            } else {
                CartFactory.fetchMyCart(user.id)
                .then(function(result){
                    console.log('LOGIN INITIATED FETCH MY CART, NO MERGE');
                    //we only need item quantity and productID on storagesessions
                    //when we build the cart we fetch the product by id anyway
                    $sessionStorage.cart = result.items.map(function(cartItem){ return {id: cartItem.productId, quantity: cartItem.quantity}});
                        console.log('SESSIONSTORAGECART AT END OF LOGIN PROCESS', $sessionStorage.cart);
                    return user;
                 });
            }
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

        this.safelyGetLoggedInUser = function(){
            return $http.get('/session')
            .then(function(response){
               var user = response.data;
               return user;
            })
            .catch(function () {
                return null;
            });
        }

        this.signup = function(credentials) {
            return $http.post('/api/signup', credentials)
            .then(function(response) {
                return response;
            })
            .then(onSuccessfulLogin)
            .catch(function () {
                    return $q.reject({ message: 'Signup unsuccessful.' });
            });
        };

        this.login = function (credentials) {
            return $http.post('/api/login', credentials)
                .then(onSuccessfulLogin)
                .catch(function () {
                    return $q.reject({ message: 'Invalid login credentials.' });
                });
        };

        this.logout = function () {
            return $http.post('/api/logout').then(function () {
                $sessionStorage.cart = [];
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

}());
