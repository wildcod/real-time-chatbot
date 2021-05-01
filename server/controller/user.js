const mongoose = require('mongoose')
const User = require('../models/user')



const getUsers = () => {
    User.find()
    .select("_id name")
    .exec()
    .then(users => {
        const count = users.length
        // res.status(200).json({
        //     count,
        //     users
        // })
        console.log("user ",users)
        return users
    })
    .catch(err => {
        // res.status(500).json({
        //     error : err
        // })
        return err;
    })
}
const addUserinDb = (data )=>{
       User.save({
           name:data.name,
           roomid: data.roomid,
           roomname: data.roomname
       })
       .then((res)=>{

       })
}


module.exports = {
    getUsers,
}