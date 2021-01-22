const express = require('express')
const Task = require('../models/task.model')
const auth = require('../middleware/auth')
const router = new express.Router();

//agregar task
router.post('/tasks', auth, async (req, res) => {
    //asignamos el objeto recibido a uno local
    //const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    //guardamos la nueva task en la db
    try {
        const taskAdded = await task.save();
        res.status(201).send(taskAdded)
    } catch (error) {
        res.status(400).send(error)
    }
})

//get all tasks?completed=true/false
//limit skip pagination
router.get('/tasks', auth, async (req, res) => {
    //objeto para pedir tareas completadas
    const match = {}
    //objeto vacio para las especificaciones del ordenamiento
    const sort = {}
    //si viene en la peticion
    if (req.query.completed) {
        //se le adigna true a la busqueda
        match.completed = req.query.completed === 'true'
    }
    if (req.query.sort) {
        //console.log(req.query.sort);
        const parts = req.query.sort.split(':');
        sort[parts[0]] = parts[1]
    }
    try {
        //usamos el usuario para buscar
        await req.user.populate({
            //su documento hijo
            path: 'tasks',
            //completado o no
            match,
            //paginacion
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
            //ejecutamos los filtros
        }).execPopulate()
        res.status(201).send(req.user.tasks)
    } catch (error) {
        res.status(500).send(error)
    }
});
//get task by id
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        //const task = await Task.findById(_id);
        const task = await Task.findOne({
            _id,
            owner: req.user._id
        })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
});
//patch update one attribute
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        })

        if (!task) {
            return res.status(404).send()
        }
        // const task = await Task.findById(req.params.id)

        updates.forEach((update) => task[update] = req.body[update])

        await task.save()
        //  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })        
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})
//delete task
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router;