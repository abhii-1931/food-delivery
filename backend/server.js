import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import foodRouter from './routes/foodRoutes.js'
import userRouter from './routes/userRoutes.js'
import 'dotenv/config.js'
import cartRouter from './routes/cartRoutes.js'
import orderRouter from './routes/orderRoutes.js'


// app config
const app = express()
const port = process.env.PORT || 4000


// middleware
app.use(express.json())
app.use(cors())

// connecting to db
connectDB()


// api endpoints
app.use('/images', express.static('uploads'))
app.use('/api/food', foodRouter)
app.use('/api/user', userRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)


app.get('/', (req, res)=>{
    res.send('API working')
})


app.listen(port, ()=>{
    console.log(`running on http://localhost:${port}`)
})