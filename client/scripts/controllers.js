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

app.controller('registerController',
  ['$scope', '$location', 'AuthService', 'ActivityService',
  function ($scope, $location, AuthService, ActivityService) {

    console.log(authservice.getUserStatus());

    $scope.register = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service
      console.log($scope.registerForm);
      authservice.register($scope.registerForm)
        // handle success
        .then(function () {
          $scope.disabled = false;
          $scope.registerForm = {};
          var savedActivity = activityservice.getSavedActivity();
          activityservice.saveClickedActivity(undefined) // dispose of clicked activity
          console.log('is there a saved activity?', savedActivity);
          var user = authservice.getUserStatus();

          if (savedActivity) {
            console.log('saved activity should be defined: ', savedActivity);
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
          $scope.errorMessage = "User already registered, please login!";
          $scope.disabled = false;
          $scope.registerForm = {};
        });

    };

}]);

app.controller('homeController', ['$scope', '$http', '$route', '$location', 'PlanService', 'ActivityService', 'UserService', '$routeParams', function ($scope, $http, $route, $location, PlanService, ActivityService, $routeParams, UserService) {
  console.log('route params: ', $routeParams);

  $scope.resetDivs = function () {
    $scope.info = { // a list of all divs for accordian
      hero: true,
      one: false,
      two: false,
      three: false,
      four: false,
      five: false,
      six: false,
      seven: false,
      eight: false
    }
  }

  $scope.resetDivs()

  // see if a user is logged in
  $scope.user_id = authservice.getUserStatus()
  console.log('user is logged in', $scope.user_id);

  // see if any saved activities and set $scope.showActivity
  console.log ('is there a saved activity this time through?', activityservice.getSavedActivity());
  $scope.showActivity = activityservice.getSavedActivity()
  activityservice.saveClickedActivity(undefined) // dispose of saved Activity

  //get list of activites, open activity if url includes activity title OR if there is an activity in
  activityservice.getActivities().then(function (docs) {
    $scope.activities = docs;
    $scope.limitStart = []
    for (var i = 0; i < ($scope.activities.length / 3); i++) {
      $scope.limitStart.push(i * 3)
      console.log($scope.limitStart);
    }
    if ($routeParams.title) { // check if a particular activity is asked for…
      $routeParams.title = $routeParams.title.replace(/-/g, ' ') // get rid of dashes, actually, strip it to letters only
      console.log('title from the routeParams: ', $routeParams.title);
      $scope.activities.forEach(function(activity){
        console.log(activity.title); // make a temp variable here and strip it to letters only too so the match matches
        if (activity.title === $routeParams.title){ // need to verify that this will match in the end
          console.log('found a match!');
          activityservice.saveClickedActivity(activity)
          $location.path('/')
        }
      })
    }
  })


  //get userPlan (array of activities) and userPlan id
  if ($scope.user_id) {
    userservice.getUser($scope.user_id).then(function (data) {
      console.log(data);
      $scope.name = data.fname;
    })
    planservice.getUserPlan($scope.user_id).then(function(data) {
      if (data) {
        $scope.userPlan = data;
        $scope.planStart = []
        for (var i = 0; i < ($scope.userPlan.length / 3); i++) {
          $scope.planStart.push(i * 3)
        }
        console.log('user plan: ', $scope.userPlan);
        $scope.activities.forEach(function (activity) {
          if ($scope.userPlan.indexOf(activity._id) >= 0){
            activity.inUserPlan = true;
          }
        })
      } else {
        $scope.userPlan = []
      }
      $scope.toggleDiv('one')
    })
  } else {
    console.log('no one is logged in');
  }

  $scope.reset = function () { // resets all activities to closed
    $scope.activities.forEach(function (activity) {
      activity.open = false;
    })
  }

  $scope.toggleDiv = function (div) {
    var temp = $scope.info[div]
    for (item in $scope.info) { // close all divs (make this a reset service?)
      $scope.info[item] = false
    }
    $scope.info[div] = !temp; // div is now the opposite of what it was before
    if (!$scope.info.one && !$scope.info.two
    && !$scope.info.three && !$scope.info.four
    && !$scope.info.five && !$scope.info.six
    && !$scope.info.seven && !$scope.info.eight) {
      $scope.info.hero = true; // change this so hero is always open and nav slides over hero (animate it?)
    }
  }

  $scope.addToPlan = function (user, activity) {
    if (user === null) {
      // capture the activity that the user was trying to add
      $scope.activities.forEach(function (element) {
        if (element._id === activity) {
          activityservice.saveClickedActivity(element)
        }
      })
      $location.path('/register');
    } else {
      console.log("user found, add this activity to plan", activity);
      planservice.addToPlan(user, activity).then(function () {
        planservice.getUserPlan(user).then(function (data) {
          $scope.userPlan = data
          $scope.userPlan = data;
          $scope.planStart = []
          for (var i = 0; i < ($scope.userPlan.length / 3); i++) {
            $scope.planStart.push(i * 3)
          }
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
        $scope.user_id = null;
        $scope.userPlan = undefined;
        $scope.resetDivs();
        $scope.activities.forEach(function (activity) {
          activity.inUserPlan = false;
        })
        $location.path('/');
      });
  }

}]);

app.controller('planController',
  ['$scope', '$location', '$http', '$routeParams', 'PlanService', 'ActivityService', 'UserService', function ($scope, $location, $http, $routeParams, PlanService, ActivityService, UserService) {

    console.log($routeParams.id);
    $scope.user = $routeParams.id;

    activityservice.getActivities().then(function (docs) {
      $scope.activities = docs
      console.log($scope.activities);
      $scope.limitStart = []
      for (var i = 0; i < ($scope.activities.length / 3); i++) {
        $scope.limitStart.push(i * 3)
      }
    })

    planservice.getUserPlan($scope.user).then(function(doc) {
      console.log('user plan: ', doc);
      if (!doc) {
        console.log("no plan!");
        $scope.user = undefined;
      } else {
        $scope.userPlan = doc;
        $scope.activities.forEach(function (activity) {
          if ($scope.userPlan.indexOf(activity._id) >= 0){
            activity.inUserPlan = true;
          }
        })
      }
    })

    userservice.getUser($scope.user).then(function (data) {
      if (data) {
        $scope.name = data.fname
      }
    })


    $scope.reset = function () { // resets all activities to closed
      $scope.activities.forEach(function (activity) {
        activity.open = false;
      })
    }

}]);

app.controller('activitiesController',
  ['$scope', '$location', '$http', function ($scope, $location, $http) {

    $scope.addActivity = function (activity) {
      //send form data to database here? or from /activities route?
      $http.post('/activities', activity);
      $scope.activity = {};
    }

}]);
