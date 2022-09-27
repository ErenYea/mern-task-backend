import express from "express";
import mongoose from "mongoose";
import Users from "./mongoos.js";
import cors from "cors";
import dbPost from "./dbPost.js";
import fileUpload from "express-fileupload";
// import

// app config
const app = express();
const port = process.env.PORT || "9000";
const allowedExtension = [".png", ".jpg", ".jpeg"];

//db connection
mongoose.connect(
  "mongodb+srv://drstone:hamzaalikhan@cluster0.kjxeldw.mongodb.net/merntask?retryWrites=true&w=majority"
);
var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
db.once("open", () => {
  console.log("Db connected");
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
      res.status(500).send(err);
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
