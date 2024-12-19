import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { ACCESSTOKENKEY, REFRESHTOKENKEY} from "../constants.js";

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:[true, "Password Needed"]
    },
    refreshToken:{
        type:String
    }

},{
    timestamps: true,
})


userSchema.pre("save", async function(next){
    // if(!this.isModified("password")) return next();
    console.log("save method");
    
    this.password = await bcrypt.hash(this.password, 8);
    next();
})


userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}


userSchema.methods.generateAccessToken = async function(password){
    return jwt.sign({
        _id: this._id, 
        email: this.email
    },
    ACCESSTOKENKEY,
    {
        expiresIn: "7m"
    }
    )
}


userSchema.methods.generateRefreshToken = async function(password){
    return jwt.sign({
        _id: this._id,
    },
    REFRESHTOKENKEY,
    {
        expiresIn: "5d"
    }
    )
}




const User = mongoose.model("User", userSchema);

export default User