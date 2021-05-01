const Pool = require("pg").Pool;
const pool = new Pool({
     user: "me",
     host: "localhost",
     database: "api",
     password: "password",
     port: 5432,
});

const getMessages = (request, response) => {
    pool.query(
       "SELECT * FROM messages ORDER BY id DESC LIMIT 10",
       (error, results) => {
          if (error) {
             throw error;
          }
          response.status(200).json(results.rows);
       }
    );
 };

 const createMessage = (request, response) => {
    const { text, username } = request.body;
    pool.query(
    "INSERT INTO messages (text, userid) VALUES ($1, $2) RETURNING  text, username, created_at",
       [text, username],
       (error, results) => {
          if (error) {
             throw error;
          }
          response.status(201).send(results.rows);
          }
    );
 };
 const getSocketMessages = () => {
    return new Promise((resolve) => {
       pool.query(
          "SELECT * FROM messages ORDER BY id DESC LIMIT 10",
          (error, results) => {
             if (error) {
                throw error;
             }
             resolve(results.rows);
           }
       );
    });
 };
 const createSocketMessage = (message) => {
    return new Promise((resolve) => {
       pool.query(
          "INSERT INTO messages (text, userid) VALUES ($1, $2) RETURNING text, username, created_at",
          [message.text, message.username],
          (error, results) => {
             if (error) {
                throw error;
             }
             resolve(results.rows);
          }
       );
    });
 };

 const createUser = (user) => {
    return new Promise((resolve) => {
       pool.query(
          "INSERT INTO users (username, roomnameid) VALUES ($1, $2) RETURNING text, username, created_at",
          [message.text, message.username],
          (error, results) => {
             if (error) {
                 console.log("line 70")
                throw error;
             }
             resolve(results.rows);
          }
       );
    });
 }; 


const getUsers = (request, response) => {
    pool.query(
       "SELECT * FROM users ORDER BY created_at DESC LIMIT 10",
       (error, results) => {
          if (error) {
             throw error;
          }
          console.log(results);
          response.status(200).json(results.rows);
       }
    );
 };

 module.exports = {
    // getMessages,
    // createMessage,
    // getSocketMessages,
    // createSocketMessage,
    getUsers
 
 };