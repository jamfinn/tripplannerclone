app.factory('AuthService', ['$q', '$timeout', '$http', function ($q, $timeout, $http) {

  authservice = {}

    // create user variable
    // var user = null;
    // var user_id = sessionStorage.getItem('user') || null;

    authservice.isLoggedIn = function() {
      if(sessionStorage.getItem('user')) {
        return true;
      } else {
        return false;
      }
    }

    authservice.getUserStatus = function() {
      return sessionStorage.getItem('user');
    }

    authservice.login = function (username, password) {
      console.log('authservice.login');

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/user/login', {username: username, password: password})
      // handle success // test for success
      .success(function (data, status) { // note to mherman: angular docs say .success method has been deprecated and to use .then https://docs.angularjs.org/api/ng/service/$http
        console.log('login service', data);
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

    authservice.register = function(username, password) {

    // create a new instance of deferred
    var deferred = $q.defer();

      console.log('hello from authservice.register');
    // send a post request to the server
    $http.post('/user/register', {username: username, password: password})
      // handle success
      .success(function (data, status) {
        console.log('hello!');
        console.log('data', data);
        if(status === 200 && data.user_id){
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
