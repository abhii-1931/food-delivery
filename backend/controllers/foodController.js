import { log } from "console";
import foodModel from "../models/foodModel.js";
import fs from 'fs'


// add food item
const addFood = async (req, res) => {
    
    let image_filename = `${req.file.filename}`
    const {name, description, price, category} = req.body
    const food = new foodModel({
        name,
        description,
        price,
        image:image_filename,
        category
    })

    try {
        await food.save()
        res.json({success:true, message:'Food Added'})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }

}


// all food list
const listFood = async (req, res) => {
  
    try {
        
        const foods = await foodModel.find({})
        console.log(foods);
        res.json({success:true, data:foods})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
    
}


// remove food item
const removeFood = async (req, res) => {
    
    try {
        
        const food = await foodModel.findById(req.body.id)
        fs.unlink(`uploads/${food.image}`, ()=>{})
        await foodModel.findByIdAndDelete(food.id)
        res.json({success:true, message:'Food deleted!'})
        
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }

}


export {addFood, listFood, removeFood}