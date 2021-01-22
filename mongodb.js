//CRUD 

// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID;

// const { MongoClient, ObjectID } = require('mongodb')
// //do not use localhost, use ip direction
// const connectionURL = 'mongodb://127.0.0.1:27017';
// //create database
// const databaseName = 'task-manager';

// MongoClient.connect(connectionURL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }, (error, client) => {
//     if (error) {
//         return console.log('Unableto connect to database');
//     }
//     const db = client.db(databaseName)

//     // db.collection('users').deleteMany({
//     //     age: 21
//     // }).then(()=>{
//     //     console.log('Borrado alv');
//     // }).catch(()=>{
//     //     console.log('No se borro alv');
//     // })

//     db.collection('users').deleteOne({
//         _id: ObjectID('5f4fc47dcf7ef01b28e2ea3b')
//     }).then(()=>{
//         console.log('Csm el user');
//     }).catch(()=>{
//         console.log('No se borró nada alv');
//     })
// })