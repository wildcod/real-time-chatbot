  
const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
  _id : mongoose.Schema.Types.ObjectId,
  text: {
    type:String,
    required: true
  },
    user: {
      type: mongoose.Schema.Types.ObjectId ,
      ref: 'User',
    },
    chatroom: {
      type: mongoose.Schema.Types.ObjectId ,
      // ref: 'ChatRoom',
    },
   time : { type : Date, default: Date.now }
})

module.exports = mongoose.model('Message' ,messageSchema)
