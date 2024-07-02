const { createHmac, randomBytes} = require("crypto")  // no need to install this library
const {Schema, model } = require("mongoose");

const userSchema = new Schema({
    username : {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    }, 
},
    {timestamps: true}
);

userSchema.pre("save", function (next){
    const user = this;

    if(!user.isModified("password")) return;

    // using crypto hash - builtin package
    const salt = randomBytes(16).toString();  // 16 char long random string
    const hashedPassword = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");
    
    this.salt = salt;
    this.password = hashedPassword;

    next(); 
})

// Virtual function == matchPassword
userSchema.static("matchPassword", async function(email, password){
    let user;
    try{
        user = await this.findOne({ email });
        if (!user) {
            return { error: "Incorrect Email, Try Again" };
        }
    }catch(error){
        console.log(error.message);
        return { error: "An error occurred while finding the user" };
    }
    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt)
        .update(password)
        .digest("hex");

    try{
        if(hashedPassword !== userProvidedHash) 
            return { error: "Incorrect Password" };
        return user;
    }catch(error){
        console.log(error.message);
        return { error: "An error occurred during authentication" }
    }
})

const User = model("user", userSchema)

module.exports = User