  
const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
   _id : mongoose.Schema.Types.ObjectId,
   name : {
       type : String,
       required : true
   },
   roomid : [{
    type : mongoose.Schema.Types.ObjectId,
    required: true
   }],
   roomname:{
       type: String,
       required : true
   },
   time : { type : Date, default: Date.now }
})

module.exports = mongoose.model('User' ,userSchema)
