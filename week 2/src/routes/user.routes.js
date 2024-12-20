import { Router } from "express";
import { loginUser, registerUser, logoutUser,refreshAccessToken } from "../controllers/user.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";



const router = Router()


router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/refresh-token").post(refreshAccessToken)


router.use(verifyJWT)


router.route("/logout").post(logoutUser)

export default router