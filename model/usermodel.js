const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name:String,
    email:String,
    pass:String,
    role:{type:String,default:"customer"}
})

const usermodel = mongoose.model("user",userSchema)

module.exports = {usermodel}