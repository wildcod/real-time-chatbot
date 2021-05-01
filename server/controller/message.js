const mongoose = require('mongoose')
const Message = require('../models/message')



const getMessage = () => {
    Message.find()
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


const getlasttenMsg = (data)=>{
    
}

module.exports = {
    getMessage,
    addMessage
}