app.factory('AuthService', ['$q', '$timeout', '$http', '$cookies', function ($q, $timeout, $http, $cookies) {

  authservice = {}

    // authservice.isLoggedIn = function() {
    //   if(sessionStorage.getItem('user')) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }

    authservice.getUserStatus = function() {
      // console.log('userid cookie item ', cookie.getItem('userid'));
      console.log('user', typeof $cookies.get('user'));
      var id = $cookies.get('user');
      console.log(id[2]);
      // console.log('parsed id', id);


      return sessionStorage.getItem('user');
    }

    authservice.login = function (username, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/user/login', {username: username, password: password})
      // handle success // test for success
      .success(function (data, status) { // note to mherman: angular docs say .success method has been deprecated and to use .then https://docs.angularjs.org/api/ng/service/$http
        if(status === 200 && data.user_id){
          // user = true;
          sessionStorage.setItem('user', data.user_id);
          deferred.resolve();
        } else {
          user = false;
          deferred.reject();
        }
      })
      // handle error
      .error(function (data) {
        user = false;
        deferred.reject();
      });

      // return promise object
      return deferred.promise;

      };

      authservice.logout = function() {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a get request to the server
      $http.get('/user/logout')
      // handle success
      .success(function (data) {
        console.log('logged out!');
        user = false;
        user_id = null;
        sessionStorage.clear()
        deferred.resolve();
      })
      // handle error
      .error(function (data) {
        user = false;
        deferred.reject();
      });

      // return promise object
      return deferred.promise;

    };

    authservice.register = function(userInfo) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/user/register', userInfo)
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.user_id){
            // user = true
            sessionStorage.setItem('user', data.user_id);
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    return authservice;
}]);

app.factory('PlanService', ['$q', '$timeout', '$http', function ($q, $timeout, $http) {

  planservice = {}

    planservice.getPlans = function () {
      // create a new instance of deferred
      var deferred = $q.defer();

      $http.get('/plans/').success(function (docs) {
        deferred.resolve(docs);
      })

      // handle error
      .error(function (data) {
        deferred.reject();
      });

      // return promise object
      return deferred.promise;
    }

    planservice.getUserPlan = function (user) {
      // create a new instance of deferred
      var deferred = $q.defer();

      $http.get('/plans/' + user).success(function (doc) {
        console.log('got a user plan', doc);
        deferred.resolve(doc.plan);
      })

      // handle error
      .error(function (data) {
        deferred.reject();
      });

      // return promise object
      return deferred.promise;
    }

    planservice.addToPlan = function(user, activity) {

      console.log('in add to plan! user, activity', user, activity);
      // create a new instance of deferred
      var deferred = $q.defer();

      $http.post('/plans', {user: user, activity: activity}).success(function (doc) {
        console.log('reponse from post/plans is plan_id/user_id: ', doc);
        deferred.resolve();
      })

      // handle error
      .error(function (data) {
        deferred.reject();
      });

      // return promise object
      return deferred.promise;
    }

    planservice.removeFromPlan = function(user, activity) {

      // create a new instance of deferred
      var deferred = $q.defer();

      $http.post('/plans/' + user, {user: user, activity: activity}).success(function (doc) {
        deferred.resolve();
      })

      // handle error
      .error(function (data) {
        deferred.reject();
      });

      // return promise object
      return deferred.promise;

    }

    return planservice;
}]);

app.factory('ActivityService', ['$q', '$timeout', '$http', function ($q, $timeout, $http) {

  activityservice = {}

  var savedActivity = undefined

    activityservice.getRowArray = function (activities, cols){
      var intervals = []
      for (var i = 0; i < activities.length / cols; i++) {
        intervals.push(i * cols)
      }
      return intervals;
    }

    activityservice.getActivities = function () {
      // create a new instance of deferred
      var deferred = $q.defer();

      $http.get('/activities/').success(function (docs) {
        deferred.resolve(docs);
      })

      // handle error
      .error(function (data) {
        deferred.reject();
      });

      // return promise object
      return deferred.promise;
    }

    activityservice.saveClickedActivity = function (activity) {
      console.log('saving activity', activity);
        savedActivity = activity
    }

    activityservice.getSavedActivity = function () {
      console.log('getting saved activity', savedActivity);
      return savedActivity;
    }

    return activityservice;
}]);

app.factory('UserService', ['$q', '$timeout', '$http', function ($q, $timeout, $http) {

  userservice = {}

    userservice.getUser = function (user) {
      // create a new instance of deferred
      var deferred = $q.defer();
      console.log('user in getFname', user);
      $http.get('/user/' + user).success(function (docs) {
        console.log(docs);
        deferred.resolve(docs);
      })

      // handle error
      .error(function (data) {
        deferred.reject();
      });

      // return promise object
      return deferred.promise;
    }

    return userservice;
}]);
