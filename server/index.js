//jshint esversion:6

require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const fs = require("file-system");
const multer = require("multer");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
var bodyParser = require("body-parser");

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, "./uploads");
  },
  filename: function (request, file, callback) {
    console.log(request);
    console.log(file);
    var temp_file_arr = file.originalname.split(".");
    var temp_file_name = temp_file_arr[0];
    var temp_file_extension = temp_file_arr[1];
    callback(
      null,
      temp_file_name + "-" + Date.now() + "." + temp_file_extension
    );
  },
});

var upload = multer({ storage: storage });
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const { redirect } = require("express/lib/response");

const uri = "mongodb://root:rootPassword@127.0.0.1:27017";
const PORT = process.env.PORT || 3001;
let userDetails = {};

// using config vars to handle multiple environments for now
let URL = process.env.URL;

if (process.env.NODE_ENV !== "production") {
  console.log("not prod");
  URL = "http://localhost:3001";
}

// /app.use(bodyParser.json());

// need this to parse the json with the req
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(express.static("server/uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//app.use(express.text());
console.log("pathe name => ");
console.log(express.static(path.join(__dirname, "uploads")));
app.use(
  cors({
    origin: "*",
  })
);

//connect to Mongo
mongoose
  .connect(uri)
  .then(() => console.log("Now connected to MongoDB!"))
  .catch((err) => console.error("Something went wrong", err));

//Schemas
const itemSchema = new mongoose.Schema({
  key: String,
  id: String,
  title: String,
  bids: Number,
  price: Number, //will be stored in cents?
  highBidder: String,
  highBidderId: String,
  seller: String,
  sellerId: String,
  img: String,
  auctionStartDate: String,
  auctionEndDate: String,
});

const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  googleId: String,
  watchList: String,
  token: String,
});

//userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

//Models
const Item = mongoose.model("Item", itemSchema);
const User = new mongoose.model("User", userSchema);

// Have Node serve the files for React app
// app.use(express.static(path.resolve(__dirname, "../client/build")));

// check if logged in
loggedIn = (req, res, next) => {
  console.log(req.user);
  if (req.user) {
    //can also be req.isAuthenticated()
    next();
  } else {
  }
};
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "server/uploads");
  },
  filename: function (req, file, callback) {
    var temp_file_arr = file.originalname.split(".");
    var temp_file_name = temp_file_arr[0];
    var temp_file_extension = temp_file_arr[1];
    callback(
      null,
      temp_file_name + "-" + Date.now() + "." + temp_file_extension
    );
  },
});

var upload = multer({ storage: storage }).single("product_picture");
app.post("/add", (req, res) => {
  upload(req, res, function (error) {
    if (error) {
      return res.end("Error Uploading File");
    } else {
      const record = { ...req.body, img: req.file.filename };
      const item = new Item(record);
      //item.img = req.file.buffer.toString("base64");
      item.save();
      res.status(200).json(item);
    }
  });

  //console.log(req.file);
  // console.log("image path ");
  // console.log(req.file);
  // console.log(req.file.filename);
  // console.log(req.file.product_picture);
  // console.log("buffer");
  // console.log(req.file.buffer);
  // //console.log("filessssssssssssssssssssssssssssss");
  // var img = fs.readFileSync(req.file.filename);
  // //console.log("image");
  // console.log(img);
  // console.log("imageeeeeeeeeeeeeeeeeee");
  //var encode_image = img.toString("base64");
  // Define a JSONobject for the image attributes for saving to database
  // var finalImg = {
  //   contentType: req.file.mimetype,
  //   image: Buffer.from(encode_image, "base64"),
  // };

  //console.log(req.file.buffer.toString("base64"));
  //res.send(file);
  //const body = { ...req.body, img: req.file.buffer.toString("base64") };

  //add response here, check others ******************************************************************
});

app.get("/all", (req, res) => {
  console.log("getting all records");
  Item.find({}, (err, foundItems) => {
    if (!err) {
      res.send(foundItems);
    } else {
      console.log(err);
    }
  });
});

app.post("/bid", loggedIn, (req, res, next) => {
  let { id, bids, price } = req.body;
  Item.find({ id: id }, (err, foundItem) => {
    if (!err) {
      if (foundItem[0].highBidderId != req.user.id) {
        Item.findOneAndUpdate(
          { id: id },
          {
            bids: bids,
            price: price,
            highBidder: req.user.username,
            highBidderId: req.user.id,
          },
          (err, foundItem) => {
            if (!err) {
              console.log("Updated: ", foundItem.title);
              //need to send a response else the fetch hangs up
              res.status(200).json({ success: true });
            } else {
              console.log("Error: ", err);
            }
          }
        );
      } else {
        res.status(200).json({ success: true });
      }
    } else {
      console.log("Error: ", err);
    }
  });
});

app.post("/delete", loggedIn, (req, res, next) => {
  const itemToDeleteID = req.body;
  console.log(itemToDeleteID);
  Item.find({ id: itemToDeleteID }, (err, foundItem) => {
    if (!err) {
      console.log(foundItem);
      if (foundItem[0].sellerId === req.user.id) {
        Item.findOneAndDelete({ id: itemToDeleteID }, (err, deletedItem) => {
          if (!err) {
            console.log("deleted: ", deletedItem);
            res.status(200).json({ success: true });
          } else {
            console.log("Error: ", err);
          }
        });
      }
    } else {
      console.log("Error: ", err);
    }
  });
});

app.post("/edit", loggedIn, (req, res, next) => {
  let { id, title, img } = req.body;
  console.log(id);
  Item.find({ id: id }, (err, foundItem) => {
    if (!err) {
      console.log(foundItem);
      let newData = { title: title, img: img };
      Item.findOneAndUpdate({ id: id }, newData, (err, itemToUpdate) => {
        if (!err) {
          console.log("Updated ", itemToUpdate);
        } else {
          console.log(err);
        }
      });
    } else {
      console.log(err);
    }
  });
});

/*
app.get("/loggedin", (req, res) => {
  console.log("loggedin");
  console.log(req.user);
  if (req.isAuthenticated()) {
    res.send(req.user);
  } else {
    res.status(401).end();
  }
  //needs a response if not logged in?
});
*/

app.post("/login", (req, res) => {
  let { username, password } = req.body;

  const user = new User({
    username: username,
    password: password,
  });

  const token = jwt.sign(
    { user_id: user._id, username },
    process.env.TOKEN_KEY,
    {
      expiresIn: "24h",
    }
  );
  // save user token
  //user.token = token;
  console.log("login user", { token, username });
  res.status(200).json({ id: user._id, token, username });

  /*
  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/");
      });
    }
  });
  */
});

app.get("/logout", function (req, res) {
  req.logOut();
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      // userDetails = {};
      res.redirect("/");
    }
  });
});

app.post("/register", async (req, res) => {
  console.log(req.body);
  let { username, password } = req.body;
  console.log(User);
  const oldUser = await User.findOne({ username });

  if (oldUser) {
    return res
      .status(409)
      .send({ message: "User Already Exist. Please Login" });
  }

  //Encrypt user password
  encryptedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    password,
    email: username.toLowerCase(), // sanitize: convert email to lowercase
    password: encryptedPassword,
  });
  console.log("user created", user);
  //User.register({ username: username }, password, function (err, user) {
  if (user) {
    console.log(err);

    const token = jwt.sign(
      { user_id: user._id, username },
      process.env.TOKEN_KEY,
      {
        expiresIn: "24h",
      }
    );
    console.log("login");
    console.log(token);
    // save user token
    user.token = token;
    //}
    //passport.authenticate("local")(req, res, function () {
    res.redirect("/");
    //});
  }
  //});
});

// catchall route
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
// });

//add record
function addRecord() {
  const item = new Item({
    key: "asdfasdf",
    title: "asdfasdf",
    bids: 2,
    price: 2, //will be stored in cents?
    highBidder: "asss",
    highBidderId: "sd",
    seller: "sajid",
    sellerId: "seler",
  });
  console.log("adding");
  console.log(item);
  console.log("body");

  item.save();
}
//addRecord();

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
