app.directive('simHeader', [function() {
  return {
    restrict: 'EA',
    scope: {
      user: '=',
      plan: '=',
      logo: '=',
      logoText: '=',
      logout: '&'
    },
    templateUrl: './partials/directives/header.html'
  }
}])

app.directive('simHero', [function() {
  return {
    restrict: 'EA',
    scope: {
      user: '=',
      heroImage: '=',
      heroText: '=',
      title: '=',
      cta: '='
    },
    templateUrl: './partials/directives/hero.html'
  }
}])

app.directive('simNavBar', [function() {
  return {
    restrict: 'EA',
    scope: {
      user: '=',
      plan: '=',
      info: '=',
      label: '='
    },
    templateUrl: './partials/directives/nav-bar.html'
  }
}])

app.directive('simShareBox', [function() {
  return {
    restrict: 'EA',
    scope: {
      user: '='
    },
    templateUrl: './partials/directives/sharebox.html'
  }
}])

app.directive('simActivity', [function() {
  return {
    restrict: 'EA',
    scope: {
      user: '=',
      activity: '=',
      showActivity: '=',
      planAction: '&',
      planPage: '=',
      dummy: '='
    },
    templateUrl: './partials/directives/activity.html'
  }
}])

app.directive('simActivityDetail', [function() {
  return {
    restrict: 'EA',
    scope: {
      user: '=',
      activity: '=',
      planAction: '&',
      planPage: '='
    },
    templateUrl: './partials/directives/activity-detail.html'
  }
}])

app.directive('simFooter', [function() {
  return {
    restrict: 'EA',
    scope: {
      orgLink: '=',
      organization: '=',
      park: '=',
      parkLink: '=',
      year: '=',
      nav1Link: '=',
      nav1Text: '=',
      nav2Link: '=',
      nav2Text: '=',
      nav3Link: '=',
      nav3Text: '=',
      nav4Link: '=',
      nav4Text: '='
    },
    templateUrl: './partials/directives/footer.html'
  }
}])
