app.config(function ($routeProvider) {

  $routeProvider
    .when('/', {
      templateUrl: './partials/home.html',
      controller: 'homeController',
      access: {restricted: true}
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
    .when('/one', {
      template: '<h1>This is page one!</h1>',
      access: {restricted: false}
    })
    .when('/two', {
      template: '<h1>This is page two!</h1>',
      access: {restricted: false}
    })
    .when('/activities/new', {
      templateUrl: './partials/activities/new.html',
      access: {restricted: false}
    })
    .otherwise({
      redirectTo: '/'
    });

});
