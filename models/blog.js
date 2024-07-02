const {Schema, model } = require("mongoose");

const blogSchema = new Schema({
    title : {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    coverImageURL: {
        type: String,
    }, 
    isPublic: {
        type: Boolean,
        default: false,
    },
    Category: {
        type: String,
        default: "None",
    },
    Likes: {
        type: Number,
        default: 0,
    },
    Date: {
        type: String,
    },
    Time: {
        type: String,
    },
    CreatedBy: {
        type: Schema.Types.ObjectId,
        ref: "users",
    }
},
    {timestamps: true}
)

const Blog = model("blog", blogSchema)

module.exports = Blog