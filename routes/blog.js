const { Router } = require("express")

const Blog = require("../models/blog")
const User = require("../models/user")
const Topic = require("../models/topic");

const router = Router();
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        return cb(null, "./public/uploads")
    },
    filename: function (req, file, cb){
        return cb(null, `${Date.now()}-${file.originalname}`)
    },
})

const upload = multer({ storage })

router.post("/show", async (req, res) => {
    try{
        // const {title, content } = req.body

        await Blog.create( {
            title: req.body.title,
            content: req.body.content,
            Date: new Date(),
            CreatedBy: req.user._id,  // we are getting req.user from auth middleware
        })

        // those blogs which are made by the same user i.e. who are logged in 
        const allblogs = await Blog.find({ CreatedBy: req.user._id })
        return res.render("showBlogs.ejs",{
            blogs: allblogs
        })
    }catch(error){
        console.log("The Error: ",error.message)
        res.render("createBlog.ejs", {
            req_error: "Both Fields are required",
        })
    }
})

router.get("/show", async (req, res) => {
    const allblogs = await Blog.find({ CreatedBy: req.user._id })
    res.render('showBlogs.ejs', {
        blogs: allblogs
    })
})

router.get("/feed", async (req, res) => {
    try{
        const allblogs = await Blog.find({})
        const data = []
        for (const blog of allblogs){
            if(blog.isPublic){
                try{
                    const user = await User.findById(blog.CreatedBy).select('username');
                    // blog.username = user.username
                    const blogData = {
                        ...blog.toObject(),
                        username: user.username,
                    };
                    data.push(blogData)
                }catch{
                    console.log("user not found")
                }
            }
        }

        const topics = await Topic.find({})
        res.render('feed.ejs', {
            data: data,
            topics: topics,
        })
    }catch(error){
        console.error('Error fetching blogs:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

router.get("/create", (req, res) => {
    res.render('createBlog.ejs')
})

/// one blog to show
router.get("/:id", async (req, res) => {
    try{
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).send('Blog not found');
        }
        const topics = await Topic.find({})
        res.render('myblog.ejs', { blog, topics: topics }); // Adjust to your view template
    }
    catch{
        res.status(500).send('Server error');
    }
})

router.get("/delete/:id", async (req, res) =>{
    try{
        const result = await Blog.findByIdAndDelete(req.params.id);
        if (result) {
            console.log('Document deleted:', result);
            // const allblogs = await Blog.find({});
            const allblogs = await Blog.find({ CreatedBy: req.user._id })
            return res.render("showBlogs.ejs", {
                blogs: allblogs,
            });
        } else {
            console.log('No document found with that id.');
        }       
    }
    catch(error){
        console.error('Error deleting document:', error);
    }
})

router.post("/uploads/:id", upload.single("blog-cover"), async (req, res) => {
    try{
        console.log(req.body)
        console.log(req.file)
        const url = req.file.filename
        const blog = await Blog.findById(req.params.id); 
        
        if(blog){
            blog.coverImageURL = `/uploads/${url}`;
            // Save the updated blog back to the database
            await blog.save();
            // const allblogs = await Blog.find({})
            const allblogs = await Blog.find({ CreatedBy: req.user._id })
            return res.render("showBlogs.ejs",{
                blogs: allblogs
            })  
        }
    }catch (error) {
        console.error('Error updating blog cover image:', error);
        return res.status(500).send('Internal Server Error');
    }
})

router.get('/feed/:name', async (req, res) => {
    try {
        const topic_name = req.params.name;
        const blogs = await Blog.find({Category: topic_name});
        if (!blogs) {
            return res.status(404).json({ message: 'No Blogs found with that category' });
        }
        const topics = await Topic.find({})
        const data = []
        for (const blog of blogs){
            if(blog.isPublic){
                try{
                    const user = await User.findById(blog.CreatedBy).select('username');
                    // blog.username = user.username
                    const blogData = {
                        ...blog.toObject(),
                        username: user.username,
                    };
                    data.push(blogData)
                }catch{
                    console.log("user not found")
                }
            }
        }
        res.render("feed.ejs",{
            topics: topics,
            data: data,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

router.post('/public/:id', async (req, res) => {
    try {
        const blogId = req.params.id;
        const public = req.body; 
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        blog.isPublic = public.public;
        await blog.save();
        const allblogs = await Blog.find({ CreatedBy: req.user._id })
        res.render("showBlogs.ejs",{
            blogs: allblogs
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

router.post('/add-topic', async (req, res) => {
    try{
        const topic = req.body.topic;

        if(topic === ""){
            res.render("createTopic.ejs");
            return;
        }
        await Topic.create({ name: topic})
        res.redirect('/');
    }catch(err){
        console.log("Error in fetching the topic name", err)
    }
})

router.get('/topic/:id/:name', async (req, res) => {
    try{
        const blogId = req.params.id;
        const topic_name = req.params.name;
        
        const blog = await Blog.findById(blogId);
        if(blog.isPublic){
            blog.Category = topic_name;
            await blog.save();
        }

        if(topic_name === ""){
            res.render("createTopic.ejs");
            return;
        }
        res.redirect('/blog/'+blogId);
    }catch(err){
        console.log("Error in fetching the topic name", err)
    }
})

router.get('/like/:id', async (req, res) => {
    try{
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId);
        if(blog,Likes){
            let prev = Number(blog.Likes)
            blog.Likes = String(prev + 1)
            await blog.save();
        }else{
            blog.Likes = "1"
            await blog.save();
        }
    }catch(error){
        console.log("Error in fetching the Blog Id", err)
    }
})

module.exports = router