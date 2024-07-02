const { Router } = require("express")
const { handleSignup, handleLogin } = require("../controllers/user")


const User = require("../models/user")

const router = Router();

router.get("/login", (req, res) => {
    res.render('login.ejs')
})

// router.post("/login", async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const storedData = await User.findOne({ email: email });
//         if (storedData) {
//             if (storedData.password === password) {
//                 res.redirect('/');
//             } else {
//                 console.log("Wrong password");
//             }
//         } else {
//             console.log("User Not Found");
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Internal Server Error");
//     }
// });

router.get("/register", (req, res) => {
    res.render('register.ejs')
})

// router.post("/register", async (req, res) => {
//     const {username, email, password} = req.body;
//     const storedData = await User.findOne({ email: email})
//     if(storedData){
//         console.log("Email already exists")
//     }else{
//         User.create({
//             username,
//             email,
//             password,
//         })
//         res.redirect('/')
//     }
// })

router.post("/register", handleSignup)
router.post("/login", handleLogin)



module.exports = router