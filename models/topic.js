const {Schema, model } = require("mongoose");

const topicSchema = new Schema({
    name : {
        type: String,
        required: true,
    },
},
{timestamps: true}
)

const Topic = model("topic", topicSchema)

module.exports = Topic