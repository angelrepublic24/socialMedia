const validator = require('validator');

const validate = (body) => {
    let name = !validator.isEmpty(body.name) && 
                validator.isLength(body.name, {min:3, max: undefined})
                validator.isAlpha(body.name, 'en-US');

    let surname = !validator.isEmpty(body.surname) && 
                    validator.isLength(body.surname, {min:3, max: undefined}) &&
                    validator.isAlpha(body.surname, 'en-US');
                    
    let email = !validator.isEmpty(body.email) && validator.isEmail(body.email)
                   
    let password = !validator.isEmpty(body.password) && validator.isLength(body.password, {min:3, max: undefined})

    if(body.bio) {
        let bio = validator.isLength(body.bio, {min:undefined, max: 300})
         if(!bio) {
            throw new Error('Invalid')
        }else {
            console.log('Valid')
        }
    
    }

    if(!name || !surname || !email || !password){
        throw new Error('Invalid ')
    }else {
        console.log('Valid')
    }
}

module.exports = validate;