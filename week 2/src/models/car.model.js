import mongoose from "mongoose";


const carSchema = mongoose.Schema({
    carType:{
        type:String,
    },
    brand:{
        type:String,
    },
    model:{
        type:String,
    },
    price:{
        type:Number,
    },
    rentPrice:{
        type:Number,
    }
})


const Car = mongoose.model("Car", carSchema)

export default Car