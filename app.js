require('dotenv').config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { restrictToLoggedinUserOnly } = require('./middlewares/auth')

const Topic = require('./models/topic')

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const app = express();
const PORT = process.env.PORT || 3000;

// MONGO_URI="mongodb://127.0.0.1:27017/myblogs"

const MONGO_URL = process.env.MONGO_URI;

mongoose.connect(MONGO_URL).then(() => console.log("Mongoose Connected!"))

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false}))
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get("/", async (req, res) => {
    const topics = await Topic.find({})
    res.render('home.ejs', {
        topics: topics
    })
})

app.get("/create-topic", (req, res) => {
    res.render('createTopic.ejs')
})

app.use('/user', userRoute )
app.use('/blog', restrictToLoggedinUserOnly, blogRoute ) 


app.listen(PORT, () =>{ console.log(`listening on port: ${PORT}`)})