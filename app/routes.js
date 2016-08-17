module.exports = function (app, passport) {

    app.get('/login', function (req, res) {
        if (req.user)
            res.render('profile.ejs', { user: req.user });
        else
            res.render('login.ejs', { message: '' });
    });

    app.get('/auth', function (req, res) {
        if (req.isAuthenticated())
            res.status(200).send();
        else
            res.status(401).send();
    });

    app.post('/login', passport.authenticate('local-login'), function (req, res, next) {
        console.log('User: ' + req.user.id + ' was log in');
        switch (app.args.redirect) {
            case 'url':
                console.log('redirect to url ', app.args.redirect_url)
                res.redirect(app.args.redirect_url);
                break;
            case 'refer':
                console.log('redirect to refer ', req.get('Referrer'))
                res.redirect(req.get('Referrer'));
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

    app.get('/logout', isLoggedIn, function (req, res) {
        req.logout();
        res.redirect('/login');
    });

    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/login');
    }

}