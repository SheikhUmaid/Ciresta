import mongoose from "mongoose";




const bookingSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    bookingName:{
        type: String,
        required: true
    },
    car:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Car",
        required:true,
    },
    days:{
        type: Number,
        required: true
    },

}, {
    timestamps:true,
})




const Booking = mongoose.model("Booking", bookingSchema)

export default Booking