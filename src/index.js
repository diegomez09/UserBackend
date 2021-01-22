//impoirtamos express
const express = require('express')
//importamos mongoose
require('./db/mongoose')
//user router
const userRouter = require('./routers/user')
//task router
const taskRouter = require('./routers/task')
//hago un objeto de tipo express con las herramientas de la libreria
const app = express();
//defino el puerto
const port = process.env.PORT;
//parseo todo lo que llega a la app como JSON
app.use(express.json())
//send to expres the routes USER
app.use(userRouter)
//router tasks
app.use(taskRouter)
app.listen(port, () => {
    console.log('Server running on port ' + port);
})

// const multer = require('multer')
// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(doc|docx)$/)) {
//             return cb(new Error('Solo acepta archivos word'))
//         }
//         cb(undefined, true)
//         // cb(new Error('Tiene que ser pdf'))
//         // cb(null, true)
//         // cb(null,false)
//     }
// })

// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({
//         error: error.message
//     })
// })

// midleware test
// app.use((req, res, next) => {
//     if(req.method === 'GET'){
//         return res.send('Cannot do GET query')
//     }else{
//         next()
//     }
//     console.log(req.method, req.path);
//     next();
// })
//midleware para mantenimiento
// app.use((req, res, next) => {
//     res.status(503).send('Sitio en mantenimiento')
// })
//populate mongoose example
// const Task = require('./models/task.model');
// const User = require('./models/user.model');

// const main = async () => {
//     const task = await Task.findById('5f57704c495c5f122401ff63')
//     await task.populate('owner').execPopulate()
//     console.log(task.owner);
//     const user = await User.findById('5f576ee62292b116b425e852')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks);
// }
//main()
//const jwt = require('jsonwebtoken')

//const myFunciton = async () => {
    //hasheo de strings
    // const saltRounds = 10;
    // const psw = 'sombreriyohello'
    // const hashed = await bcrypt.hash(psw, saltRounds)
    // console.log(psw);
    // console.log(hashed);
    //validacion del hasheo vs el string
    // const matching = await bcrypt.compare(psw, hashed)
    // console.log(matching);
    //expiracion del token
    //const token = jwt.sign({ _id: 'ola123' }, 'apiprueba', { expiresIn: '7 days' })
    //console.log(token);
    //validacion del token
    //const validte = jwt.verify(token, 'apiprueba')
    //console.log(validte);
//}

//myFunciton()