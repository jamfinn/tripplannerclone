app.config(function ($routeProvider) {

  $routeProvider
    .when('/', {
      templateUrl: './partials/home.html',
      controller: 'homeController',
      access: {restricted: false}
    })
    .when('/activity/:title', {
      templateUrl: './partials/home.html',
      controller: 'homeController'
    })
    .when('/plan/:id', {
      templateUrl: './partials/plan.html',
      controller: 'planController'
    })
    .when('/login', {
      templateUrl: './partials/login.html',
      controller: 'loginController',
      access: {restricted: false}
    })
    .when('/register', {
      templateUrl: './partials/register.html',
      controller: 'registerController',
      access: {restricted: false}
    })
    .when('/activities/new', {
      templateUrl: './partials/activities/new.html',
      controller: 'activitiesController',
      access: {restricted: false}
    })
    // .when('/:id', {
    //   templateUrl: './partials/home.html',
    //   controller: 'homeController',
    //   access: {restricted: true}
    // })
    .otherwise({
      redirectTo: '/'
    });

});
