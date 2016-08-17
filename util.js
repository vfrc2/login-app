var bcrypt = require('bcrypt-nodejs');

var utils = {};

utils.encrypt = function encryptPass(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

utils.compare = function comparePass(password, hash) {
    return bcrypt.compareSync(password, hash);
}

module.exports = utils;

if (!module.parent) {
    require('yargs')
        .usage('$0 <cmd> [args]')
        .nargs('file', 1)
        .alias('file', 'f')
        .describe('file','JSON file add or append')
        .default('file', '.passwd.json')
        .global('file')
        .command('hash <password>', 'hash password',
        {}, function (args) {
            console.log(utils.encrypt(args.password));
        })
        .command('save <user> <password>', 'save password to JSON file',
        {}, function (args) {
            
            var fs = require('fs');

            if (fs.existsSync(args.file)) {
                var db = require('./' + args.file);
            } else {
                db = {};
            }

            db[args.user] = utils.encrypt(args.password);

            console.log(db[args.user]);

            fs.writeFileSync(args.file, JSON.stringify(db, {}, ' '));
        })
        .help()
        .argv

}
