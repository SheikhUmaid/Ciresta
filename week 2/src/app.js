import express, {urlencoded} from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
cookieParser
const app = express();

// app.use(cors({
//     origin: process.env.CORSORIGIN,
//     credentials: true
// }))

app.use(express.json({limit:"16kb"}))
app.use(urlencoded({extended:true}))
app.use(cookieParser())
app.use(express.static("public"));

import userRouter from "./routes/user.routes.js"
import carRouter from "./routes/car.routes.js"
import bookingRouter from "./routes/booking.route.js"

app.use("/user", userRouter)
app.use("/car", carRouter)
app.use("/bookings", bookingRouter)


export default app;