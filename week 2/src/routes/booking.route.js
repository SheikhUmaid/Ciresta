import { cancelBooking, createBooking } from "../controllers/booking.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js"
import { Router } from "express";


const router = Router();

router.use(verifyJWT)
router.route("/booking").post(createBooking)
router.route("/cancel").delete(cancelBooking)


export default router;