const express = require("express")
const userRouter = express.Router()
require('dotenv').config()
const {usermodel } = require("../model/usermodel");
const {authenticate} = require("../middlewares/authenticate")
const{authorize}=require("../middlewares/authorize")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const fs = require("fs")
// const redis = require("redis")

// const client=redis.createClient()
// client.connect()

userRouter.get("/",(req,res)=>{
    res.send("base api endpoint")
})

userRouter.get("/reports",authenticate,authorize("admin"),(req,res)=>{
	res.send("reports..")
	})


///////////-------------cookies--------------------//
// userRouter.get("/welcome",(req,res)=>{
//     const name =req.cookies.name||""
//     const location =req.cookies.location||""
//     res.send(`Welcome ${name} from ${location}`)
// })

// userRouter.get("/users",(req,res)=>{
//     res.cookie("name","manthan")
//     res.cookie("location","pune")
//     res.send("welcome userr")
// })
// userRouter.get("/admins",(req,res)=>{
//     res.send("welcome admin")
// })


////-----------------/////


userRouter.post("/signup",(req,res)=>{
    const {name,email,pass,role} = req.body
    bcrypt.hash(pass, 5, async function(err, hash) {
        const user = new usermodel({
            name:name,
            email:email,
            pass:hash,
            role
        })
        await user.save()
        res.send({"msg":"registration successfull"})
        console.log(user)
    });
})

userRouter.post("/login", async (req, res) => {
    const {email, pass} = req.body;

    const user = await usermodel.findOne({email})
    if(!user){
        res.status(400).send("Please signup first")
        return
    }
    const hashedpwd = user?.pass
    bcrypt.compare(pass, hashedpwd, function(err, result) {
        if(result){
            const token = jwt.sign({userID : user._id, role : user.role}, process.env.secretkey, {expiresIn : "1m"})
            const refresh_token = jwt.sign({userID : user._id}, process.env.secondkey, {expiresIn : "2m"})
            res.send({msg : "login successfull", token, user, refresh_token})
        }
        else{
            res.status(400).send("login failed")
        }
    });
})



//------blacklisting-----//

userRouter.get("/logout",(req,res)=>{
const token = req.headers.authorization
try {
    //client.LPUSH("black",token)
    const blacklisteddata = JSON.parse(fs.readFileSync("./blacklist.json", "utf-8"))
    blacklisteddata.push(token)
    fs.writeFileSync("./blacklist.json", JSON.stringify(blacklisteddata))
    res.send({"msg":"Logged out successfully"})
} catch (error) {
    console.log(error)
}
})


//----------refreshtoken------------//

userRouter.get("/gettoken",(req,res)=>{ 
    const reftoken = req.headers.authorization
    if(!reftoken){
        res.status(400).send("Login again!")
        return
    }
    jwt.verify(reftoken, process.env.secondkey, function(err,decoded) {
        if(err){
            res.status(400).send({msg:"Please login again","err":err.message})
        }else{
            const token = jwt.sign({userID:decoded.userID},process.env.secretkey,{expiresIn:"1d"})
            res.send({"msg":"login successfull",token})
        }
      });
})


module.exports = {userRouter}