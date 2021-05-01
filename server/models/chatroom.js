  
const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name : {
        type : String,
        required : true
    },
    userid : [{
     type : mongoose.Schema.Types.ObjectId,
     ref : 'Student',
    }],
    time : { type : Date, default: Date.now }
 })

module.exports = mongoose.model('chatroom' ,chatSchema)
