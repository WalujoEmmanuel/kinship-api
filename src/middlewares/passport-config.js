const queries = require('../services');
const config = require('../config')
const passport = require('passport');
const passportJWT = require('passport-jwt');
let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = config.jwtconf.jwtSecret;

let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  let user = queries.getOne('pos.users','user_id',jwt_payload.user_id);
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

passport.use(strategy);

module.exports = passport;