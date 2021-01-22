const jwt = require('jsonwebtoken');
const User = require('../models/user.model')

const auth = async (req, res, next) => {
    try {
        //el token llega mediante la peticion (el usuario la brinda mediante header)
        const token = req.header('Authorization').replace('Bearer ', '')
        //se crea el objeto que contiene el resultado decodificado ejem:
        //{ _id: '5f566de43cd05023889894dd', iat: 1599515538 }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        //con esos datos usamos el user model que tiene mongoose para buscar si existe
        const user = await User.findOne({
            //asgnamos id
            _id: decoded._id,
            //asignamos token al arreglo de tokens
            'tokens.token': token
        })
        //si no regresó un user exitoso es que valio cabeza
        if (!user) {
            throw new Error()
        }
        //asignamos el token
        req.token = token
        //si hay user modificamos la request y le asignamos el usuario validado
        req.user = user;
        //le damos acceso a la peticion aka endpoint
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error,
            message: "Invalid token"
        });
    }
}

module.exports = auth;