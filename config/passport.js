var LocalStrategy = require('passport-local').Strategy;
var util = require('../util.js');

module.exports = function (passport) {

    var usedDb = require('../.passwd.json');


    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        if (usedDb[id]) {
            done(null, { id: id, passwordHash: usedDb[id] });
        } else {
            done(new Error('No such user ' + id));
        }
    });

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        function (req, email, password, done) {

            if (usedDb[email]) {
                var passwordHash = usedDb[email];

                if (util.compare(password, passwordHash)) {
                    done(null, {
                        id: email,
                        password: passwordHash
                    });
                    return;
                }
                 done(new Error('Wrong password!'));
            }

            done(new Error('Wrong user or email!'));
        }));

}