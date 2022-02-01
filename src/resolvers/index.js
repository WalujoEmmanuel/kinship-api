const graphql = require('graphql');
const bcrypt = require('bcrypt');
const config = require('../config');
const queries = require('../services');
const { sendEmail } = require('../utils/email');


module.exports = {
    getAll(objType, obj) {
        return {
            type: new graphql.GraphQLList(objType),
            resolve(parent, args) {
                return queries.getAll(obj);
            }
        }
    },

    getOne(objType, obj, args, searchKey) {
        return {
            type: objType,
            args: args,
            resolve(parent, args) {
                return queries.getOne(obj, searchKey, args[searchKey])
            }
        }
    },

    addOne(objType, obj, args) {
        return {
            type: objType,
            args: args,
            async resolve(parent, args) {
                let data = {}

                for (const i in args) {
                    if (args.hasOwnProperty(i) && args[i] !== '' || null || undefined) {
                        data[i] = args[i]
                    }

                    if (args.hasOwnProperty(i) && args[i] !== '' || null || undefined) {
                        if (objType == "User" && i === 'passwd') {
                            data[i] = bcrypt.hashSync(args[i], config.jwtconf.saltRounds);
                        } else {
                            data[i] = args[i];
                        }
                    }
                }

                results = await queries.create(obj, data);

                results = results[0]

                if (objType == "User" && Object.keys(results).length > 0 && results.user_id && results.email) {

                    const companies = await queries.getAll('pos.company')

                    const compayName = companies[0].name
                    const fromEmail = companies[0].email
                    const toEmail = args.email
                    const subject = "Your account login credentials"
                    const body = `
                        Hello ${args.user_name}, <br/>
                        <b>WELCOME TO ${compayName}.</b> <br/>
                        Here are your login credentials, Please login to the system and change your password. <br/>
                        <b>Email: </b> ${args.email} <br/>
                        <b>Password: </b> ${args.passwd} <br/>
                    `

                    sendEmail(fromEmail, toEmail, subject, body)
                }

                return results
            }
        }
    },

    updateOne(objType, obj, args, searchKey) {
        return {
            type: objType,
            args: args,
            async resolve(parent, args) {
                let data = {}
                let updateid = args[searchKey];

                for (const i in args) {

                    if (args.hasOwnProperty(i) && i != args[searchKey] && args[i] !== '' || null || undefined) {
                        if (objType == "User" && i === 'passwd') {
                            data[i] = bcrypt.hashSync(args[i], config.jwtconf.saltRounds)
                        } else {
                            delete args[searchKey];
                            data[i] = args[i];
                        }
                    }
                }
                await queries.update(obj, searchKey, updateid, data);
                _details = await queries.getOne(obj, searchKey, updateid);
                return _details;
            }
        }
    },

    deleteOne(objType, obj, args, searchKey) {
        return {
            type: objType,
            args: args,
            async resolve(parent, args) {
                _details = await queries.getOne(obj, searchKey, args[searchKey]);
                _deleted = await queries.delete(obj, searchKey, args[searchKey]);

                if (_deleted) {
                    return _details;
                }

                return {};
            }
        }
    },

}