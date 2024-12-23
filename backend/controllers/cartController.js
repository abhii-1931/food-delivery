import userModel from '../models/userModel.js'


const addToCart = async (req, res) => {
  try {
    
    let userData = await userModel.findOne({_id:req.body.userId})
    let cartData = await userData.cartData
    if (!cartData[req.body.itemId]) {
        cartData[req.body.itemId] = 1
    } else {
        cartData[req.body.itemId] += 1
    }
    await userModel.findByIdAndUpdate(req.body.userId, {cartData})
    res.json({success:true, message:'item added'})
    
} catch (error) {
    console.log( error)
        res.json({success:false, message:error.message})
    }
}


const removeFromCart = async (req, res) => {
    
    try {
        
        const user = await userModel.findOne({_id:req.body.userId})
        let cartData = await user.cartData
        if (cartData[req.body.itemId]>0) {
            cartData[req.body.itemId] -= 1
        }
        await userModel.findByIdAndUpdate(req.body.userId, {cartData})
        res.json({success:true, message:'item removed'})
        
    } catch (error) {
        console.log( error)
        res.json({success:false, message:error.message})
    }

}


const getCart = async (req, res) => {
  try {
    
    const user = await userModel.findOne({_id:req.body.userId})
    console.log(user);
    const cartData = await user.cartData
    
    res.json({success:true, cartData})
    
} catch (error) {
    console.log(error)
      res.json({success:false, message:error.message})
  }
}



export {addToCart, removeFromCart, getCart}