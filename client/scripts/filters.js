app.filter('myActivities', function () {
  return function (input, array) {
    var myActivities = []
    if (input && array) {
        input.forEach(function (activity) {
          if (array.indexOf(activity._id) >= 0){
            myActivities.push(activity)
          }
        })
    }
    return myActivities;
  };
});

app.filter('activityType', function () {
  return function (input, string) {
    if (string === 'all') {
      return input;
    } else {
      var activityTypes = []
      if (input && string) {
        input.forEach(function (activity) {
          if (activity[string]){
            activityTypes.push(activity)
            console.log(activityTypes);
          }
        })
      }
      return activityTypes;
    }
  };
});
