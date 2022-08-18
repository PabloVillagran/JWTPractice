const { response } = require('express')
const express = require('express')
const { JsonWebTokenError } = require('jsonwebtoken')
const router = express.Router()
const passport = require('passport')
const tokenator = require('../auth/authenticateToken')//modulo de manejo de tokens jwt

require('../auth/authenticateUser')//carga de configuraciones de passport

router.post('/0000/client', passport.authenticate('signup', {session: false}), async (request, response, next)=>{//create user
    const user = {_id:request.user._id, email:request.user.email}
    const token = tokenator.generateAccessToken(user);//tokeniza usuario y _id
    const refresh = tokenator.generateRefreshToken(user);//genera llave "refresh" para usuario
    
    response.json({
        message: 'Signup successful',
        token: token,
        refresh: refresh
    });
})

router.post('/0001/client', passport.authenticate('login', {session:false}), async (request, response, next)=>{//login user
    const user = {_id:request.user._id, email:request.user.email}
    const token = tokenator.generateAccessToken(user);//tokeniza usuario y _id
    const refresh = tokenator.generateRefreshToken(user);//genera llave "refresh" para usuario

    response.json({
        token:token,
        refresh: refresh
    });
})

router.delete('/0001/client', tokenator.deleteRefresh, (request, response)=>{//ruta de logout
    console.log('logout')
})

router.post('/0001/client/refresh', tokenator.validateRefresh, (request, response)=>{//ruta de refresh
    console.log('refresh token')
})

// router.put('/0001/client', , async(request, response, next)=>{//servicio de cambio de contraseña //TODO

// })

module.exports = router;