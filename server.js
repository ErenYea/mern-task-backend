import express from "express";
import mongoose from "mongoose";
import Users from "./mongoos.js";
import cors from "cors";
import dbPost from "./dbPost.js";
import fileUpload from "express-fileupload";
import Pusher from "pusher";
import pako from "pako";
import fs from "fs";
import util from "util";
import SnappyJS from "snappyjs";
// var SnappyJS = require("snappyjs");
// import

var logFile = fs.createWriteStream("log.txt", { flags: "a" });
// Or 'w' to truncate the file every time the process starts.
var logStdout = process.stdout;

console.log = function () {
  logFile.write(util.format.apply(null, arguments) + "\n");
  logStdout.write(util.format.apply(null, arguments) + "\n");
};
console.error = console.log;
// app config
const app = express();
const port = process.env.PORT || "9000";
const allowedExtension = [".png", ".jpg", ".jpeg"];
// const pusher = new Pusher({
//   appId: "1482620",
//   key: "69b5a077e6f30925c3f7",
//   secret: "cd7fd44524b63dc0e595",
//   cluster: "ap2",
//   useTLS: true,
// });
//db connection
mongoose.connect(
  "mongodb+srv://drstone:hamzaalikhan@cluster0.kjxeldw.mongodb.net/merntask?retryWrites=true&w=majority"
);
var db = mongoose.connection;

// db.on('error', console.error.bind(console, 'connection error:'));
db.once("open", () => {
  console.log("Db connected");
  // const msgCollection = db.collection("posts");
  // const changeStream = msgCollection.watch();

  // changeStream.on("change", (change) => {
  //   // console.log(change);
  //   if (change.operationType === "insert") {
  //     const messageDetails = change.fullDocument;
  //     console.log(messageDetails.image.data);
  //     console.log(typeof messageDetails.image.data);
  //     // var gip = pako.gzip(messageDetails.image.data);
  //     var gip = SnappyJS.compress(messageDetails.image.data);
  //     // var base64EncodedStr = btoa(
  //     //   unescape(encodeURIComponent(messageDetails.image.data))
  //     // );
  //     pusher.trigger("posts", "inserted", {
  //       title: messageDetails.title,
  //       description: messageDetails.scription,
  //       image: gip,
  //       user: messageDetails.user,
  //     });
  //   } else {
  //     console.log("Error trigerrring Pusher");
  //   }
  // });
});

// middleware
app.use(express.json());
app.use(cors());
app.use(fileUpload());

//routes
app.get("/", (req, res) => {
  res.status(200).send({
    message: "Hello",
  });
});

app.post("/signup", (req, res) => {
  const data = req.body;
  console.log(data);

  Users.create(data, (err, data) => {
    if (err) {
      res.status(500).send("The email is already in database");
    } else {
      res.status(201).send(data);
    }
  });
});

app.post("/createpost", (req, res) => {
  const data = req.body;
  const file = req.files.file;
  console.log(data);
  console.log(file);
  const datas = {
    title: data.title,
    description: data.description,
    user: data.user,
    image: {
      data: file.data,
      contentType: file.mimetype,
    },
  };
  dbPost.create(datas, (err, datass) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(datass);
    }
  });
});

app.get("/post", (req, res) => {
  dbPost.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.get("/users", (req, res) => {
  Users.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});
// listen
app.listen(port, () => console.log(`Listening to localhost:${port}`));
