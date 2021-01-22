const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('./task.model')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email invalido')
            }
            // console.log('Added:', value);
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('La edad tiene que ser un numero positivo')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Incluye la palabra password')
            }
            // console.log('Se añadio la contraseña');
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

//
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})
//return user without tokens and password
userSchema.methods.toJSON = function () {
    //creamos un user a base de luserSchema
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}
//genera token para el usuario
userSchema.methods.generateToken = async function () {
    //el usuario creado objeto
    const user = this
    //obtenemos el token
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    //asignamos token al objeto usuario
    user.tokens = user.tokens.concat({ token })
    //guardamos en mongo
    await user.save()
    //regresamos el token nuevo
    return token
}
//recibe los parametros del login
userSchema.statics.findByCredentials = async (email, password) => {
    //usa un metodo de mongoose en base al email
    const user = await User.findOne({
        email
    })
    if (!user) {
        throw new Error('Unable to login')
    }
    //bcrypt verifica que la contraseña input sea igual q la de mongo
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }
    //retorna el usuario logeado
    return user
}

//Hash plain taxt psword
//premiddleware before save user on mongo
userSchema.pre('save', async function (next) {
    //obtenemos el usuario
    const user = this
    //si la contraseña es nueva se hashea
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    //se guarda en mongo
    next()
})
//delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
    //creamos el usuario recibido
    const user = this
    //borramos todas las tasks que tengan el id del uduario
    await Task.deleteMany({
        owner: user._id
    })
    next()
})
//el modelo se asigna a un objeto
const User = mongoose.model('User', userSchema)

module.exports = User;