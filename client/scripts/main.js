var app = angular.module('tripPlanner', ['ngRoute', 'ngAnimate']);

app.run(function ($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    console.log('hello from main.js');
    // console.log('event ', event)
    // console.log('next', next);
    // console.log('current', current);
    // if (next.access.restricted && authservice.isLoggedIn() === false) {
    //   $location.path('/login');
    // }
  });
});
