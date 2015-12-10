app.filter('myActivities', function () {
  return function (input, array) {
    console.log(input);
    console.log(array);
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
