const jwt = require('jwt-simple');
const moment = require('moment');

// importar clave
const libJwt = require('../services/jwt')
const secret = libJwt.secret

// funcion de autenticacion

exports.auth = (req, res, next) => {
// comprobar si llega la cabecera de auth
    if(!req.headers.authorization){
        return res.status(403).json({
            status: 'error',
            message: "The header is missing"
        })
    }

     /* Limpiar comillas u otro caracter (/['""]/g) asi eliminamos comillas y 
     comillas dobles y con la g indicamos que sea global*/  
    let token = req.headers.authorization.replace(/['"]+/g, '');
        // decodificar el Token
        try {
            let payload = jwt.decode(token, secret);
                // Comprobar expiracion del token
                if(payload.exp <= moment().unix()){
                    res.status(401).json({
                        status: 'error',
                        message: "The token has expired",
                    });
                }
        // agregar datos de usuario a request
        req.user = payload;


        }catch(error){
            res.status(404).send({
                status: 'error',
                message: "The token is not valid",
                error
            });
        }

       
        // pasar a ejecucuion
        next();
}
