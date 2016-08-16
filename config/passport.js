var LocalStrategy   = require('passport-local').Strategy;

module.exports = function(passport) {

    var root = {
        id: 'root',
        password: '1234',
        email: 'root@root.org'
    }

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, 'root');
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        done(null, root);
    });

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { 

        if (email == 'root') {
            if (password === root.password){
                done(null, root);
                return;
            }
        }

        done(new Error('Wrong user or email!'));
    }));

}