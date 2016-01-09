app.controller('loginController', ['$scope', '$location', 'AuthService', 'ActivityService', 'PlanService', function ($scope, $location, AuthService, ActivityService, PlanService) {

    console.log('user status: ', authservice.getUserStatus());

    $scope.login = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      authservice.login($scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function (data) {
          $scope.disabled = false;
          $scope.loginForm = {};
          var savedActivity = activityservice.getSavedActivity();
          activityservice.saveClickedActivity(undefined) // dispose of clicked activity
          console.log('is there a saved activity?', savedActivity);
          var user = authservice.getUserStatus();

          if (savedActivity) {
            planservice.addToPlan(user, savedActivity._id)
          }
          $location.path('/')
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

app.controller('homeController', ['$scope', '$http', '$route', '$location', 'PlanService', 'ActivityService', '$routeParams', function ($scope, $http, $route, $location, PlanService, ActivityService, $routeParams) {
  console.log('route params', $routeParams);
//   $scope.$watch(function(){
//    return $location.path();
// }, function(value){
//    var temp = value.split("/");
//    var urlForActivity = temp[temp.length-1];
//    $http.post('/activities/getActivity', {_id: urlForActivity}).then(function(res){
//      $scope.showInfo = res.data;
//      $scope.showPage = true;
//    })
// })
  // see if a user is logged in
  $scope.user_id = authservice.getUserStatus();
  console.log('user is logged in', $scope.user_id);

  //get list of activites, open activity if url includes activity title OR if there is an activity in
  activityservice.getActivities().then(function (docs) {
    $scope.activities = docs;
    if ($routeParams.title) { // check if a particular activity is asked for…
      $routeParams.title = $routeParams.title.replace(/-/g, ' ') // get rid of dashes
      $scope.activities.forEach(function(activity){
        // console.log(activity.name);
        if (activity.title === $routeParams.title){
          console.log('found a match!');
          // $scope.showInfo = activity
          $scope.showActivity = activity // use this to make sure activity is open
          console.log('activity url', $scope.showActivity);
        }
      })
    }
    // deferred.resolve(data);
  })
  // .error(function () {
  //   console.log('error');
  //   // deferred.reject("Error!");
  // });

  // if $routeParams.id go get plan id
  if ($routeParams.id) {
    console.log('got an id!');
    planservice.getPlans().then(function(plans) {
      console.log(plans);
      plans.forEach(function(plan){
        if (plan._id === $routeParams.id) { // need to at this point go get the plan to display in a new div, not the "myPlan" div…
          // need to write the getPlan function to get the Plan from the url parameters
          $scope.showPlan = plan
          console.log($scope.showInfo);
        }
      })
    })
  }

  //get userPlan if user has one
  if ($scope.user_id) {
    planservice.getUserPlan($scope.user_id).then(function(data) {
      $scope.userPlan = data
      $scope.activities.forEach(function (activity) {
        if ($scope.userPlan.indexOf(activity._id) >= 0){
          activity.inUserPlan = true;
        }
      })
      console.log('user plan: ', $scope.userPlan);
    })
  } else {
    console.log('no one is logged in');
  }


  $scope.addToPlan = function (user, activity) {
    if (user === null) {
      // capture the activity that the user was trying to add
      $scope.activities.forEach(function (element) {
        if (element._id === activity) {
          activityservice.saveClickedActivity(element)
          // console.log(activityservice.getSavedActivity());// go to this url at the end of the login!!!
        }
      })
      $location.path('/login');
    } else {
      console.log("user found, add to plan", activity);
      planservice.addToPlan(user, activity).then(function () {
        planservice.getUserPlan(user).then(function (data) {
          $scope.userPlan = data
          $scope.activities.forEach(function (activity) {
            if ($scope.userPlan.indexOf(activity._id) >= 0){
              activity.inUserPlan = true;
            }
          })
          console.log('user plan', $scope.userPlan);
        })
      })
    }
  }

  $scope.removeFromPlan = function (user, activity) {
    planservice.removeFromPlan(user, activity).then(function () {
      planservice.getUserPlan(user).then(function (data) {
        $scope.userPlan = data
        $scope.activities.forEach(function (activity) {
          if ($scope.userPlan.indexOf(activity._id) === -1){
            activity.inUserPlan = false;
          }
        })
        console.log('user plan', $scope.userPlan);
        if ($scope.userPlan.length === 0) {
          $scope.myPlan = false;
        }
      })
    })
  }

  $scope.login = function () {
    $location.path('/login')
  }
  $scope.logout = function () {
    // call logout from service
    authservice.logout()
      .then(function () {
        console.log('user status from logout', authservice.getUserStatus());
        $scope.user_id = user_id;
        $scope.userPlan = undefined;
        $location.path('/');
      });
  }

}]);

// app.controller('logoutController', ['$scope', '$location', 'AuthService', function ($scope, $location, AuthService) {
//
//     $scope.logout = function () {
//
//
//       // call logout from service
//       authservice.logout()
//         .then(function () {
//           console.log('user status from logout', authservice.getUserStatus());
//           $location.path('/');
//         });
//
//     };
//
//     $scope.logout();
//
// }]);

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
          $scope.disabled = false;
          $scope.registerForm = {};
          $location.path('/');
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
