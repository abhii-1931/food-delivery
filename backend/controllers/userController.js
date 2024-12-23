import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'
// import 'dotenv/config'


const createToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET)
}


const loginUser = async (req, res) => {
  
    const {email, password} = req.body

    try {
        
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success:false, message:'user doesent exist'})
        }
        const isMatched = await bcrypt.compare(password, user.password)
        if (!isMatched) {
            return res.json({success:false, message:'Invalid credentials!'})
        }
        const token = createToken(user._id)
        res.json({success:true, token})
        
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    } 

}
 
 
const registerUser = async (req, res) => { 
  
    const {name, email, password} = req.body
    try {
        
        const exist  = await userModel.findOne({email})
        console.log(exist)
        if(exist){
            return res.json({success:false, message:'user already exists'})
        }
        if(!validator.isEmail(email)){
            return res.json({success:false, message:'please enter valid email'})
        }
        if(password.length < 8){
            return res.json({success:false, message:'please choose strong password'})
        }

        // hasing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser =  new userModel({name:name,email:email,password:hashedPassword})
        const user = await newUser.save()

        const token = createToken(user._id)
        res.json({success:true, token})
 
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }

}


export {loginUser, registerUser}