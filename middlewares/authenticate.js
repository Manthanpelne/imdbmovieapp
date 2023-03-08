const jwt = require("jsonwebtoken")
const fs = require("fs")
require('dotenv').config()
const redis = require("redis")

const client=redis.createClient()
client.connect()


const authenticate = async(req,res,next)=>{
const token = req.headers.authorization
if(!token){
    res.status(400).send({"msg":"login first"})
}

//checking is the token  is present in redis.. if present? blacklist it
const result = await client.lRange('black',0,99999999)
    if(result.indexOf(token) > -1){
      return res.status(400).json({
        status: 400,
        error: 'Please Login again!!'
    })
  }


    jwt.verify(token, process.env.secretkey, function(err, decoded) {
        if(err){
            res.status(400).send({msg:"Please login again","err":err.message})
        }else{
            const userrole = decoded?.role
            req.body.userrole=userrole
            next()
        }
      });
}
module.exports = {authenticate}