require('../src/db/mongoose')

const Task = require('../src/models/task.model');

Task.findByIdAndDelete('5f512ca60ad87f25a03222a0').then((task) => {
    return Task.countDocuments({ completed: false })
}).then((result) => {
    console.log(result);
}).catch((error) => {
    console.log(error);
})

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({ completed: false })
    return count
}

deleteTaskAndCount('5f515ad94d13ab20c0fc831b').then((task)=>{
    console.log(task);
}).catch((error)=>{
    console.log(error);
})