const express = require('express');
const router = express.Router();
const authToken = require('../auth/authenticateToken');

router.post('/cuentas', authToken.authenticateToken, (request, response, next)=>{//servicio mockup que retorna la información contenida en el token
    response.json({user: request.user});
})

module.exports = router;