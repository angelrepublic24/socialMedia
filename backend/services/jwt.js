 // dependencies
 const jwt = require('jwt-simple');
 const moment = require('moment');

 // clave secreta
 const secret = "123456789";

 // crear funcion para generar token
 const createToken = (user) => {
    const payload = {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix()
    }

    return jwt.encode(payload, secret)

 }
module.exports = {
    secret,
    createToken
}
 

