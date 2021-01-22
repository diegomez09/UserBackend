require('../src/db/mongoose')
const User = require('../src/models/user.model.js');


// 5f51130879952618c0ee97e9

User.findByIdAndUpdate('5f5119f79f67c7086c4e3686', {
    age: 1
}).then((user) => {
    console.log(user);
    return User.countDocuments({ age: 1 })
}).then((result) => {
    console.log(result);
}).catch((error) => {
    console.log(error);
})


const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, {
        age: age
    })
    const count = await User.countDocuments({ age });
    return count

}

updateAgeAndCount('5f5119f79f67c7086c4e3686', 2).then((count) => {
    console.log(count);
}).catch((e)=>{
    console.log(e);
})

