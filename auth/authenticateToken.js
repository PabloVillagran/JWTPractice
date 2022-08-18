const jwt = require('jsonwebtoken')
const TokenModel = require('../schemas/tokenSchema')

let authenticateToken = (request, response, next) =>{ //función middleware que autentica tokens
    const authHeader = request.headers['authorization'];//obtiene encabezado de autenticación
    let token = authHeader && authHeader.split(' ')[1];
    if(!token) return response.sendStatus(401);//si no existe token

    jwt.verify(token, process.env.SECRET1, (err, user)=>{//verifica token con jwt
        if (err) return response.sendStatus(403);//en caso de error

        request.user = user;//desencapsular usuario
        next();//cede al siguiente punto de middleware
    })
}

let validateRefresh = async (request, response, next) =>{//función middleware que valida llave de refresh
    const refreshToken = request.body.token;
    if(!refreshToken) return response.sendStatus(401);//si no existe token en el cuerpo del request

    const tokenDB = (await TokenModel.findOne({t: refreshToken})).t;//obtiene token de BD
    if(!tokenDB) return response.sendStatus(403);//si no existe token en BD response.sendStatus(403)

    jwt.verify(refreshToken, process.env.SECRET2, (err, user)=>{//verifica validez del token de refresh con jwt
        if(err) return response.sendStatus(403);//en caso de error
        const accessToken = generateAccessToken({_id: user._id, email: user.email});//genera nuevo token de acceso
        response.json({token: accessToken});
        next();//pasa al siguiente punto de la cadena de requests
    })
}

let deleteRefresh = async (request, response, next)=>{
    const token = request.body.token;//delete token from DB collection
    TokenModel.deleteOne({t: {$eq: token}}).then(//elimina token de base de datos
        response.sendStatus(204)
    ).catch(
        (err)=>{//en caso de error
            console.log(err);
            response.sendStatus(500);
        }
    ).finally(next());//pasa al siguiente de punto de la cadena de request
}

let generateAccessToken = (user) =>{
    return jwt.sign(user, process.env.SECRET1, {expiresIn: '15m'});//genera token de acceso con tiempo en espera
}

let generateRefreshToken = (user) =>{
    const t = jwt.sign(user, process.env.SECRET2);//genera token que no expira
    TokenModel.create({t});//almacena token en base de datos
    return t;
}

module.exports = {authenticateToken, generateAccessToken, generateRefreshToken, validateRefresh, deleteRefresh};