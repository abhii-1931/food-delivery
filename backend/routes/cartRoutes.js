import express from 'express'
import { addToCart, removeFromCart, getCart } from "../controllers/cartController.js";
import userAuth from '../middleware/auth.js';


const cartRouter = express.Router()

cartRouter.post('/add', userAuth, addToCart)
cartRouter.post('/remove', userAuth, removeFromCart)
cartRouter.get('/get', userAuth, getCart)


export default cartRouter