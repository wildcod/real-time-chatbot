const express = require("express");
const router = express.Router();

const db = require('./db/queries')

router.get("/s", (req, res) => {
  res.send({ response: "Server is up and running." }).status(200);
});
// router.get("/messages", db.getMessages);
// router.post("/messages", db.createMessage);


module.exports = router;