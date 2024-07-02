const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { restrictToLoggedinUserOnly } = require('./middlewares/auth')

const Topic = require('./models/topic')

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const app = express();
const PORT = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/myblogs").then(() => console.log("Mongoose Connected!"))

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false}))
app.use(cookieParser());


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