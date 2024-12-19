import mongoose from "mongoose";



const transactionSchema = mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
    },
    transactionPrice:{
        type: Number,
        required: true,
    },
    paymentDone:{
        type: Boolean,
        default: false,
    }
},{
    timestamps :true
})




const Transaction = mongoose.model("Transaction", transactionSchema)


export default Transaction;