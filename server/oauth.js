var ids = {

  facebook: {
   clientID: process.env.fbID,
   clientSecret: process.env.fbSecret,
   callbackURL: 'https://triplannr.herokuapp.com/auth/facebook/callback'
  },

  google: {
    clientID: process.env.googleID,
    clientSecret: process.env.googleSecret,
    callbackURL: 'https://triplannr.herokuapp.com/auth/google/callback'
  }

}

module.exports = ids
