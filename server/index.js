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
const appMessages = []



mongoose.connect('mongodb+srv://nischay:nischay@cluster0.xja6v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useFindAndModify: false,
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}, () => console.log("database connecte"));

io.on('connect', (socket) => {
    socket.on('join', ({ name, room }, callback) => {
        console.log('JOIN', name, room)
        User.findOne({ name: name, roomname: room })
            .exec()
            .then(user => {
                console.log('User', user)
                if(user){
                    User.find({ roomname: room })
                        .exec()
                        .then(users => {
                            Message.find({chatroom: user.roomid[0] }).sort('created_at').limit(10)
                                .populate('user')
                                .exec()
                                .then((msgs)=>{
                                    console.log("Messages",msgs);
                                    socket.join(room);
                                    io.to(room).emit('roomData', { room: room, users: users });
                                    const storedMessages = msgs.map(msg => ({user: msg.user.name, text: msg.text}))
                                    io.to(room).emit('intiLoadMessage', { storedMessages });
                                })
                                .catch(err =>{
                                    console.log('error',err)
                                    throw err;
                                })
                        })
                        .catch(err => {
                            console.log(err)
                            throw err
                        })
                }else{
                    User.find({ roomname: room })
                        .exec()
                        .then(users => {
                            let roomId = null;
                            if(users.length === 0){
                                roomId = mongoose.Types.ObjectId();
                            }else{
                                roomId = users[0].roomid;
                            }

                            const newUser = new User({
                                _id: mongoose.Types.ObjectId(),
                                name: name,
                                roomid: [roomId],
                                roomname: room
                            });
                            newUser.save()
                                .then((user) => {
                                    console.log('saved user', user);
                                    socket.join(room);
                                    socket.emit('message', { user: 'admin', text: `${name}, welcome to room ${room}.` });
                                    socket.broadcast.to(room).emit('message', { user: 'admin', text: `${name} has joined!` });
                                    io.to(room).emit('roomData', { room: room, users: users });
                                })
                                .catch(err => {
                                    console.log(err)
                                    throw err
                                })
                        })
                        .catch(err => {
                            console.log(err)
                            throw err
                        })
                }


            })
            .catch(err => {
                console.log(err)
                 throw err
            })
        callback();
    });

    socket.on('sendMessage', (data, callback) => {

        User.findOne({ name: data.name, roomname: data.room })
            .exec()
            .then((res) => {
                if(res){
                    const msg = new Message({
                        _id: mongoose.Types.ObjectId(),
                        chatroom: res.roomid,
                        text: data.message,
                        user: res._id
                    });
                    msg.save()
                        .then((savedMsg) => {
                        io.to(res.roomname).emit('message', { user: res.name, text: data.message });
                    })
                }
            });
        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if(user) {
            io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
        }
    })
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));