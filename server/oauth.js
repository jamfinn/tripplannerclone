var ids = {

facebook: {
 clientID: process.env.fbID,
 clientSecret: process.env.fbSecret,
 callbackURL: 'http://127.0.0.1:1337/auth/facebook/callback'
},

twitter: {
 consumerKey: process.env.twitterID,
 consumerSecret: process.env.twitterSecret,
 callbackURL: "http://127.0.0.1:1337/auth/twitter/callback"
},

google: {
 returnURL: '127.0.0.1:1337/auth/google/callback',
 realm: 'http://127.0.0.1:1337'
}

}

module.exports = ids
