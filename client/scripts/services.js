app.factory('AuthService', ['$q', '$timeout', '$http', '$cookies', function ($q, $timeout, $http, $cookies) {

  authservice = {}

    authservice.getUserStatus = function() {
    // returns userid if logged in, undefined if not
      var id = $cookies.get('user');
      console.log('user', $cookies.get('user'));
      if (id != undefined) {
        id = id.slice(3, id.length - 1)
        console.log('parsed id', id);
      }
      return id;
    }

    authservice.login = function (username, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/user/login', {username: username, password: password})
      // handle success // test for success
      .success(function (data, status) { // note to mherman: angular docs say .success method has been deprecated and to use .then https://docs.angularjs.org/api/ng/service/$http
        if(status === 200 && data.message){
          // user = true;
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
      console.log('in register service!');

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/user/register', userInfo)
        // handle success
        .success(function (data, status) {
          // console.log('successful registration!', status);
          if(status === 200 && data.message){
            // user = true
            deferred.resolve();
          } else {
            console.log('registration rejected...');
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

      // create a new instance of deferred
      var deferred = $q.defer();

      $http.post('/plans', {user: user, activity: activity}).success(function (doc) {
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

  var savedActivity = undefined;

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
        savedActivity = activity
    }

    activityservice.getSavedActivity = function () {
      return savedActivity;
    }

    return activityservice;
}]);

app.factory('UserService', ['$q', '$timeout', '$http', function ($q, $timeout, $http) {

  userservice = {}

    userservice.getUser = function (user) {
      // create a new instance of deferred
      var deferred = $q.defer();
      $http.get('/user/' + user).success(function (docs) {
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
