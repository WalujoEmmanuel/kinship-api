const graphql = require('graphql');
const bcrypt = require('bcrypt');
const config = require('../../config')
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../../utils/email')

const queries = require('../../services');

const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull, GraphQLList, GraphQLBoolean } = graphql;


var SECRET_KEY = config.jwtconf.jwtSecret;
var ACCESS_TOKEN_EXPIRATION = config.jwtconf.accessTokenExpireTime;
var REFRESH_TOKEN_EXPIRATION = config.jwtconf.refreshTokenExpireTime;

function createToken(user_id, secret_key, expiresIn) {
    let payload = { user_id: user_id };
    let token = jwt.sign(payload, secret_key, { expiresIn: expiresIn });
    return token;
}

async function storeRefreshToken(user_id, refreshToken) {
    const data = {
        "user_id": user_id,
        "token": refreshToken
    }
    const results = await queries.create("pos.refresh_tokens", data);
    return results[0];
}

async function getRefreshToken(user_id) {
    let tokens = [];
    const results = await queries.getOne("pos.refresh_tokens", "user_id", user_id);

    if (!results) return [];

    if (Array.isArray(results)) {
        results.forEach(data => {
            tokens.push(data.token);
        });
    }
    else {
        tokens.push(results.token);
    }

    return tokens;
}

async function updateRefreshToken(user_id, newRefreshToken) {
    const data = {
        "token": newRefreshToken
    }
    const results = await queries.update("pos.refresh_tokens", "user_id", user_id, data);
    return results[0];
}

async function blacklistRefreshToken(user_id) {
    const _blacklisted = await queries.delete("pos.refresh_tokens", "user_id", user_id);
    return _blacklisted;
}

function decodeToken(token, secret_key) {
    try {
        var decoded = jwt.verify(token, secret_key);
        return decoded.user_id;
    } catch (err) {
        return "Invalid Token";
        // throw ("Not Authenticated");
    }
}


const UserLoginType = new GraphQLObjectType({
    name: 'UserLogin',
    fields: () => ({
        accessToken: { type: GraphQLString },
        refreshToken: { type: GraphQLString },
        passwd: { type: GraphQLString },
        email: { type: GraphQLString },
        phone_number: { type: GraphQLString },
        fullname: { type: GraphQLString },
        user_id: { type: GraphQLID },
        user_name: { type: GraphQLString },
        message: { type: GraphQLString }
    })
});

const RefreshTokenType = new GraphQLObjectType({
    name: 'RefreshToken',
    fields: () => ({
        accessToken: { type: GraphQLString },
        refreshToken: { type: GraphQLString },
    })
});

const BlacklistTokenType = new GraphQLObjectType({
    name: 'BlacklistToken',
    fields: () => ({
        blacklisted: { type: GraphQLBoolean },
    })
});



const userLogin = {
    type: UserLoginType,
    args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        passwd: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(parent, args, context) {
        email = args.email;
        passwd = args.passwd;

        if (email && passwd) {
            let user = await queries.getOne('pos.users', 'email', email);

            if (!user) {
                return { message: 'No such user found' };
            }

            if (bcrypt.compareSync(passwd || '', user.passwd)) {
                let user_id = user.user_id;

                const storedToken = await getRefreshToken(user_id);

                let accessToken = createToken(user_id, SECRET_KEY, ACCESS_TOKEN_EXPIRATION);
                let refreshToken = "";

                if (storedToken.length) {
                    refreshToken = storedToken[0];                    
                } else {
                    refreshToken = createToken(user_id, SECRET_KEY, REFRESH_TOKEN_EXPIRATION);
                    storeRefreshToken(user_id, refreshToken);                    
                }                

                return {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    user_id: user.user_id,
                    user_name: user.user_name,
                    email: user.email,
                    phone_number: user.phone_number,
                    fullname: user.fullname,
                    message: "Login Successifull"
                };

            } else {
                return { message: 'Password is incorrect' };
            }
        }
    }
};

const userRecoverPassword = {
    type: UserLoginType,
    args: {
        email: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(parent, args, context) {
        email = args.email;

        if (email) {
            let user = await queries.getOne('pos.users', 'email', email);

            if (!user) {
                return { 
                    user_id: 0,
                    email: "",
                    message: 'User not found' 
                };
            }

            const companies = await queries.getAll('pos.company')
            
            const fromEmail = companies[0].email
            const toEmail = email
            const subject = "Ainnopos System temporary login password"
            const temporaryPassword = Math.random().toString(36).slice(7)

            const body = `
                Hello ${user.user_name}, <br/>
                Your forgotten password is recovered and here is your temporary password. Use it to login and set your new password under your profile. <br/>
                <b>Your Email: </b> ${email} <br/>
                <b>Temporary Password: </b> ${temporaryPassword} <br/>
            `

            const hashedTemporaryPassword = bcrypt.hashSync(temporaryPassword, config.jwtconf.saltRounds);

            await queries.update('pos.users', 'user_id', user.user_id, {passwd: hashedTemporaryPassword})

            sendEmail(fromEmail, toEmail, subject, body)

            return { 
                user_id: user.user_id,
                email: user.email,
                message: 'Email sent' 
            };
        }
    }
};

const userResetPassword = {
    type: UserLoginType,
    args: {
        user_id: { type: new GraphQLNonNull(GraphQLID) },
        old_password: { type: new GraphQLNonNull(GraphQLString) },
        new_password: { type: new GraphQLNonNull(GraphQLString) },
    },
    async resolve(parent, args, context) {
        if (args.user_id && args.old_password && args.new_password) {
            let user = await queries.getOne('pos.users', 'user_id', args.user_id);

            if (!user || !bcrypt.compareSync(args.old_password || '', user.passwd)) {
                return {
                    user_id: 0,
                    email: "",
                    passwd: "",
                    message: 'User not found'
                };
            }

            const hashedPassword = bcrypt.hashSync(args.new_password, config.jwtconf.saltRounds);

            await queries.update('pos.users', 'user_id', user.user_id, {passwd: hashedPassword})

            return { 
                user_id: user.user_id,
                email: user.email,
                passwd: args.new_password,
                message: 'Email sent' 
            };
        }

        return { 
            user_id: 0,
            email: "",
            passwd: "",
            message: 'User not found'
        };
    }
};

const refreshToken = {
    type: RefreshTokenType,
    args: {
        refreshToken: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(parent, args, context) {
        const token = args.refreshToken;
        const response = decodeToken(token, SECRET_KEY);

        if (!isNaN(response)) {

            const user_id = response;

            const storedToken = await getRefreshToken(user_id);

            if (storedToken.length && storedToken.includes(token)) {

                let accessToken = createToken(user_id, SECRET_KEY, ACCESS_TOKEN_EXPIRATION);
                let refreshToken = createToken(user_id, SECRET_KEY, REFRESH_TOKEN_EXPIRATION);

                updateRefreshToken(user_id, refreshToken);

                return { accessToken, refreshToken }
            }

        }

        return { accessToken: "", refreshToken: "" }
    }
}

const blacklistToken = {
    type: BlacklistTokenType,
    args: {
        token: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(parent, args, context) {
        let blacklisted = false;
        const token = args.token;
        const response = decodeToken(token, SECRET_KEY);

        if (!isNaN(response)) {

            const user_id = response;

            const storedToken = await getRefreshToken(user_id);
            
            if (storedToken.length && storedToken.includes(token)) {
                const response = await blacklistRefreshToken(user_id);
                blacklisted = response ? true : false;
            }

        }

        return { blacklisted };
    }
}




module.exports = { userLogin, refreshToken, blacklistToken, userRecoverPassword, userResetPassword };