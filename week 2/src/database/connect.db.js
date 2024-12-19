import mongoose from "mongoose";
import { DBNAME } from "../constants.js";
async function ConnectToDB() {
    try {
        await mongoose.connect(`mongodb://localhost:27017/${DBNAME}`);
        console.log("Successfully connected to DB");
        
    } catch (error) {
        console.log("Failed to establish connection with DB", error);
        process.exit(1);
        
    }
}


export default ConnectToDB;