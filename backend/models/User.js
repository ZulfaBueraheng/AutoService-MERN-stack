const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
})

userSchema.plugin(uniqueValidator)
const userModel = mongoose.model("User", userSchema)
module.exports = userModel