var ids = {

facebook: {
 clientID: process.env.fbID,
 clientSecret: process.env.fbSecret,
 callbackURL: 'https://triplannr.herokuapp.com/auth/facebook/callback'
},

twitter: {
 consumerKey: process.env.twitterToken,
 consumerSecret: process.env.twitterTokenSecret,
 callbackURL: "https://triplannr.herokuapp.com/auth/twitter/callback"
},

google: {
 returnURL: 'https://triplannr.herokuapp.com/auth/google/callback',
 realm: 'https://triplannr.herokuapp.com'
}

}

module.exports = ids
