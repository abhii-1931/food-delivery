import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const placeOrder = async (req, res) => {

    const frontendUrl = 'http://localhost:5173'
    try {
        
        // const {userId, items, amount, address} = req.body
        const newOrder = new orderModel({
            userId:req.body.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address
        })
        await newOrder.save()
        await userModel.findByIdAndUpdate(req.body.userId, {cartData:{}})

        const line_items = req.body.items.map(item=>{
            return {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: item.name,
                        // images: [item.image]
                    },
                    unit_amount: item.price * 100 *80
                },
                quantity: item.quantity
            }})
            line_items.push({
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: 'Delivery fee',
                    },
                    unit_amount: 2*100*80
                },
                quantity: 1
            })
            const session = await stripe.checkout.sessions.create({
                // payment_method_types: ['card'],
                line_items,
                mode: 'payment',
                success_url: `${frontendUrl}/verify?success=true&orderId=${newOrder._id}`,
                cancel_url: `${frontendUrl}/verify?success=false&orderId=${newOrder._id}`
            })
            res.json({success:true, session_url:session.url})


    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }

}

const verifyOrder = async (req, res) => {
  
    const {orderId, success} = req.body
    try {
        
        if (success == 'true') {
            await orderModel.findByIdAndUpdate(orderId, {payment:'true'})
            res.json({success:true, message:'Order placed successfully Paid!'})
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false, message:'Order failed Not paid!'})
        }

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
        
    }

}


const userOrders = async (req, res) => {
  
    try {
        const orders = await orderModel.find({userId:req.body.userId})
        res.json({success:true, data:orders})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
        
    }

}


const listOrders = async (req, res) => {
    try {
        
        const orders = await orderModel.find({})
        console.log(orders)
        res.json({success:true, data:orders})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})        
    }
}


const updateStatus = async (req, res) => {
    try {
        
        const {orderId, status} = req.body
        await orderModel.findByIdAndUpdate(orderId, {status})
        res.json({success:true, message:'Order status updated'})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}        

export {placeOrder, verifyOrder, userOrders, listOrders, updateStatus}