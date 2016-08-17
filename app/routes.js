module.exports = function (app, passport) {

    app.get('/login', function (req, res) {

        req.session.redirectTo =  req.query.ref || undefined; 

        if (req.user)
            res.redirect('/session');
        else
            res.render('login.ejs', { message: '', referrer:  req.session.redirectTo });
    });

    app.get('/auth', function (req, res) {
        if (req.isAuthenticated())
            res.status(200).send();
        else
            res.status(401).send();
    });

    app.post('/login', passport.authenticate('local-login'), function (req, res, next) {
        
        var referrer = req.query.referrer || '';
        
        console.log('User: ' + req.user.id + ' was log in');

        switch (app.args.redirect) {
            case 'url':
                console.log('redirect to url ', app.args.redirect_url)
                res.redirect(app.args.redirect_url);
                break;
            case 'refer':
                res.redirect(referrer);
                break;
            default:
            case 'root':
                console.log('redirect to root')
                res.redirect();
                break;
            case 'no':
                res.status(200).send(req.user.id + ' login success');
                break;
        }

    });

    app.get('/session', function(req,res) {
        res.render('profile.ejs', { user: req.user });
    })

    app.get('/logout', isLoggedIn, function (req, res) {
        req.logout();
        res.redirect('/login');
    });

    app.get('/*', function(req,res){
        res.redirect('/login'+ ((req.url != '/' || req.url != '/login') ? '?ref='+ req.url:''));
    })

    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/login');
    }

}