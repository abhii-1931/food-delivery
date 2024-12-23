import mongoose from 'mongoose'


const connectDB = async () => {
    await mongoose.connect('mongodb+srv://abhi96303:abhishekchoudhary2255@cluster0.wwlh5.mongodb.net/food-delivery').then(()=>{
        console.log('DB connected')
    }).catch((error)=>{
        console.log(error)
    })
}

export default connectDB