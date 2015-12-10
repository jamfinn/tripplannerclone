app.controller('loginController', ['$scope', '$location', 'AuthService', function ($scope, $location, AuthService) {

    console.log('user status: ', authservice.getUserStatus());

    $scope.login = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      authservice.login($scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function (data) {
          $location.path('/');
          $scope.disabled = false;
          $scope.loginForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Invalid email and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
        });
    };

}]);

app.controller('homeController', ['$scope', '$http', 'PlanService', function ($scope, $http, PlanService) {
  console.log("from homeController: ", authservice.getUserStatus());
  $scope.user_id = authservice.getUserStatus();
  console.log($scope);
  $http.get('/activities').success(function (data) {
    $scope.activities = data;
    // deferred.resolve(data);
  }).error(function () {
    // deferred.reject("Error!");
  });

  $scope.addToPlan = function (user, activity) {
    planservice.addToPlan(user, activity)
  }

}]);

app.controller('logoutController', ['$scope', '$location', 'AuthService', function ($scope, $location, AuthService) {

    $scope.logout = function () {


      // call logout from service
      authservice.logout()
        .then(function () {
          console.log('user status from logout', authservice.getUserStatus());
          $location.path('/login');
        });

    };

}]);

app.controller('registerController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    console.log(authservice.getUserStatus());

    $scope.register = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service
      authservice.register($scope.registerForm.username, $scope.registerForm.password)
        // handle success
        .then(function () {
          $location.path('/login');
          $scope.disabled = false;
          $scope.registerForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
          $scope.registerForm = {};
        });

    };

}]);

app.controller('activitiesController',
  ['$scope', '$location', '$http', function ($scope, $location, $http) {

    $scope.addActivity = function (activity) {
      console.log('activity in activitiesController', activity);
      //send form data to database here? or from /activities route?
      $http.post('/activities', activity);
      $scope.activity = {};
    }

}]);
