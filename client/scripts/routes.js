app.config(function ($routeProvider) {

  $routeProvider
    .when('/', {
      templateUrl: './partials/home.html',
      controller: 'homeController',
      access: {restricted: false}
    })
    .when('/login', {
      templateUrl: './partials/login.html',
      controller: 'loginController',
      access: {restricted: false}
    })
    .when('/logout', {
      controller: 'logoutController',
      access: {restricted: true}
    })
    .when('/register', {
      templateUrl: './partials/register.html',
      controller: 'registerController',
      access: {restricted: false}
    })
    .when('/activities', {
      templateURL: '.partials/home.html',
      controller: 'homeController',
      access: {restricted: false}
    })
    .when('/two', {
      template: '<h1>This is page two!</h1>',
      access: {restricted: false}
    })
    .when('/plan', {
      templateUrl: './partials/plan.html',
      access: {restricted: true}
    })
    .when('/activities/new', {
      templateUrl: './partials/activities/new.html',
      controller: 'activitiesController',
      access: {restricted: false}
    })
    .otherwise({
      redirectTo: '/'
    });

});
