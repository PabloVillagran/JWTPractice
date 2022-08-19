const express = require('express')
const router = express.Router()
const passport = require('passport')
const tokenator = require('../auth/authenticateToken')//modulo de manejo de tokens jwt

require('../auth/authenticateUser')//carga de configuraciones de passport

router.post('/signup', passport.authenticate('signup', {session: false}), async (request, response, next)=>{//create user
    const user = {_id:request.user._id, email:request.user.email}
    const token = tokenator.generateAccessToken(user);//tokeniza usuario y _id
    const refresh = tokenator.generateRefreshToken(user);//genera llave "refresh" para usuario
    
    response.json({
        message: 'Signup successful',
        token: token,
        refresh: refresh
    });
})

router.post('/login', passport.authenticate('login', {session:false}), async (request, response, next)=>{//login user
    const user = {_id:request.user._id, email:request.user.email}
    const token = tokenator.generateAccessToken(user);//tokeniza usuario y _id
    const refresh = tokenator.generateRefreshToken(user);//genera llave "refresh" para usuario

    response.json({
        token:token,
        refresh: refresh
    });
})

router.delete('/login', tokenator.deleteRefresh, (request, response)=>{//ruta de logout
    console.log('logout')
})

router.post('/login/refresh', tokenator.validateRefresh, (request, response)=>{//ruta de refresh
    console.log('refresh token')
})

router.post('/password', passport.authenticate('changePassword', {session:false}), async(request, response)=>{//servicio de cambio de contraseña
    console.log('Attempted to change password');
})

router.post('/password/recovery', async(request, response)=>{//servicio de olvido de contraseña
    console.log('Send email to user for password change site');
})

module.exports = router;