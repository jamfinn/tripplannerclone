var ids = {

  facebook: {
   clientID: process.env.fbID,
   clientSecret: process.env.fbSecret,
   callbackURL: 'http://demo.tripplanner.us/auth/facebook/callback'
  },

  google: {
    clientID: process.env.googleID,
    clientSecret: process.env.googleSecret,
    callbackURL: 'http://demo.tripplanner.us/auth/google/callback'
  }

}

module.exports = ids
