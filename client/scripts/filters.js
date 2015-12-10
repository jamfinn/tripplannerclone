app.filter('myActivities', function () {
  return function (input, array) {
    if (input && array) {
      var myActivities = []
        input.forEach(function (activity) {
          if (array.indexOf(activity._id) >= 0){
            myActivities.push(activity)
            console.log('myActivities', myActivities);
          }
        })
        return myActivities;
    }
  };
});
