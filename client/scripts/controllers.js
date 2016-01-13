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
            console.log('saved acivity should be defined: ', savedActivity);
            console.log('here is how user is defined: ', user);
            planservice.addToPlan(user, savedActivity._id).then(function(){ // add saved activity to plan
              savedActivity = undefined // dispose of saved activity
              console.log('saved activity should be undefined: ', savedActivity);
              $location.path('/')
            })
          } else {
            $location.path('/')
          }
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
  console.log('route params: ', $routeParams);

  // see if a user is logged in
  $scope.user_id = authservice.getUserStatus();
  console.log('user is logged in', $scope.user_id);

  // see if any saved activities and set $scope.showActivity
  // $scope.showActivity = activityservice.getSavedActivity()
  // reset saved Activity
  // activityservice.saveClickedActivity(undefined)

  //get list of activites, open activity if url includes activity title OR if there is an activity in
  activityservice.getActivities().then(function (docs) {
    $scope.activities = docs;
    if ($routeParams.title) { // check if a particular activity is asked for…
      $routeParams.title = $routeParams.title.replace(/-/g, ' ') // get rid of dashes
      $scope.activities.forEach(function(activity){
        // console.log(activity.name);
        if (activity.title === $routeParams.title){
          console.log('found a match!');
          activityservice.saveClickedActivity(activity)
          $location.path('/')
        }
      })
    }
  })

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
      if (data) {
        $scope.userPlan = data
        $scope.activities.forEach(function (activity) {
          if ($scope.userPlan.indexOf(activity._id) >= 0){
            activity.inUserPlan = true;
          }
        })
      }
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
      $location.path('/register');
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
          console.log('activities', $scope.activities);
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
        $scope.user_id = null;
        $scope.userPlan = undefined;
        $scope.activities.forEach(function (activity) {
          activity.inUserPlan = false;
        })
        $scope.plan.open = false;
        $location.path('/');
      });
  }

}]);

app.controller('registerController',
  ['$scope', '$location', 'AuthService', 'ActivityService',
  function ($scope, $location, AuthService, ActivityService) {

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
          var savedActivity = activityservice.getSavedActivity();
          activityservice.saveClickedActivity(undefined) // dispose of clicked activity
          console.log('is there a saved activity?', savedActivity);
          var user = authservice.getUserStatus();

          if (savedActivity) {
            console.log('saved acivity should be defined: ', savedActivity);
            console.log('here is how user is defined: ', user);
            planservice.addToPlan(user, savedActivity._id).then(function(){ // add saved activity to plan
              savedActivity = undefined // dispose of saved activity
              console.log('saved activity should be undefined: ', savedActivity);
              $location.path('/')
            })
          } else {
          $location.path('/');
          }
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
