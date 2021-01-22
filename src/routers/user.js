const express = require('express')
const User = require('../models/user.model')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp');
const sendWelcomeEmail = require('../emails/account')
//rutas de express
const router = new express.Router();
//add user
router.post('/users', async (req, res) => {
    //creamos un nuevo objeto con del model usuario
    const user = new User(req.body)
    //usamos mongoose para guardarlo
    try {
        //.save es para que se lo agregue al mongo  
        await user.save()
        //creo el token para el usuario
        const token = await user.generateToken()        
        //mandar correo
        sendWelcomeEmail(user.email, user.name)
        //le mandamos como resultado de la peticion el user
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})
//user by email
router.post('/users/login', async (req, res) => {
    try {
        //buscamos en mongo que los datos existan (mail, password) 
        //usando una query de mongoose en el model
        //y lo asignamos a un objeto tipo usuairo
        const user = await User.findByCredentials(req.body.email, req.body.password)
        //ese usuario genera un token
        const token = await user.generateToken()
        //devolvemos el usuario y el token a la peticion
        return res.status(200).send({ user, token })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error on read info sent",
            error,
        });
    }
})

//user log out
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (error) {
        res.status(500).send()
    }
})
//user logout all
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    } catch (error) {
        res.status(500).send()
    }
})
//get all users
router.get('/users', auth, async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users)
    } catch (error) {
        res.status(404).send(error)
    }
})
//get the logged user info 
router.get('/users/me', auth, async (req, res) => {
    //console.log(req.user);
    try {
        res.send(req.user)
    } catch (error) {
        res.status(404).send(error)
    }
})

// //get user by id
// router.get('/users/:id', auth, async (req, res) => {
//     const _id = req.params.id;
//     try {
//         const user = await User.findById(_id);
//         if (!user._id) {
//             return res.status(404).send()
//         }
//         user.password = ":D";
//         return res.status(200).send(user)

//     } catch (error) {
//         res.status(404).send()
//     }
// })

//update
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        // const user = await User.findById(req.params.id)

        updates.forEach((update) => req.user[update] = req.body[update])

        await req.user.save()

        // if (!user) {
        //     return res.status(404).send()
        // }

        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

const upload = multer({
    //dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
            return cb(new Error('Solo acepta archivos imagen'))
        }
        cb(undefined, true)
        // cb(new Error('Tiene que ser pdf'))
        // cb(null, true)
        // cb(null,false)
    }
})

//upload image
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({
        width: 250,
        height: 250
    }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, netx) => {
    res.status(400).send({
        error: error.message
    })
})
//delete image
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save()
    res.send()
})
//get image
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error('No hay user')
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (error) {
        res.send(error)
    }
})

//task api emails
//apikey

module.exports = router;