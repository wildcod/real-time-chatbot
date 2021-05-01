const http = require('http');
const express = require('express');
const socketio = require('socket.io');
// const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');


// const router = require('./router');

const userRoutes = require('./routes/user');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


const { getUsers } = require('./controller/user.js');
const User = require('./models/user');
const Message = require('./models/message');



app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



mongoose.connect('mongodb+srv://nischay:nischay@cluster0.xja6v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useFindAndModify: false,
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}, () => console.log("database connecte"));




// app.use(router);
// app.use('/', userRoutes)

io.on('connect', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    console.log("user1", user);
    // getUsers();
    console.log('socket id', socket.id);
   


    User.find({ name: name, roomname: room })
      .then(res => {
        if (res.length == 0) {
          
          User.find({ roomname: room })
            .then((alluser) => {
               let romid= null;
               console.log("allusers" ,alluser);
              if(alluser.length <=0 ){
                romid = mongoose.Types.ObjectId();
              }else{
                romid = alluser[0].roomid;
              }
              const newuser = new User({
                _id: mongoose.Types.ObjectId(),
                name: name,
                roomid: [romid],
                roomname: room
              });
              newuser.save().then((user) => {
                console.log('saved user', user);
                socket.join(user.roomname);
                socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.roomname}.` });
                socket.broadcast.to(user.roomname).emit('message', { user: 'admin', text: `${user.name} has joined!` });
                io.to(user.roomname).emit('roomData', { room: user.roomname, users: alluser });
              })
                .catch((err) => {
                  console.log(err);
                  return callback(error);
                })
            })
            .catch(err => {
              throw err
            })

        }else{
             console.log("working 83" , res);
             console.log('')
             io.to(user.roomname).emit('roomData', { room: user.roomname, users: alluser });

             Message.find({chatroom: res[0].roomid }).sort('created_at').limit(10)
             .exec()
             .then((msgs)=>{
                  console.log("linrse 72",msgs)
                  io.to(res[0].roomname).emit('message' , {msgs:"mil gya"} )
             })
             .catch(err =>{
               console.log('err line 98',err)
               throw err;
             })

        }
        callback();

      })
      .catch(err => {
        throw err;
      })


  });

  socket.on('sendMessage', ({ message, name, room }, callback) => {
    const user = getUser(socket.id);

    console.log("send mesg", user);

    User.findOne({ name: name, roomname: room })
      .exec()
      .then((res) => {
        console.log("usernaem", res)
        if (res) {
          console.log("usernamr 91", res.roomname, res.name);
          const msg = new Message({
           _id: mongoose.Types.ObjectId(),
           chatroom: res.roomid,
           text: message,
           user: res._id 
          })
          msg.save().then((savedMsg)=>{
            console.log("savemsg line 109", savedMsg)
            io.to(res.roomname).emit('message', { user: res.name, text: message });
          })
        }
      })
      .catch((err) => {
        throw err;
      })


    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    }
  })
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));