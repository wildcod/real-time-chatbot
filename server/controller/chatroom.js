const mongoose = require('mongoose')
const chatroom = require('../models/chatroom')



const getMessage = () => {
    chatroom.find()
    .select("_id name")
    .exec()
    .then(users => {
        const count = users.length
  
        console.log("user ",users)
        return users
    })
    .catch(err => {
         
        return err;
    })
}


const addMessage =(data)=>{
      mongoose.save({
         text: data.text  ,
         user : data.user,
         chatroom: data.chatroom
      } )
      .then( (message) =>{
           console.log()
      } )
}

module.exports = {
    getMessage,
    addMessage
}