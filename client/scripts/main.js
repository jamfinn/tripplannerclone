var app = angular.module('tripPlanner', ['ngRoute', 'ngAnimate']);

app.run(function ($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    // if (next.access.restricted && authservice.isLoggedIn() === false) {
    //   $location.path('/login');
    // }
  });
});
