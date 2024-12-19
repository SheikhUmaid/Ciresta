import { Router } from "express";
import { carSearch, createCar, deleteCar } from "../controllers/car.controller.js";


const router = Router();
router.route("/cars").get(carSearch)
router.route("/create").post(createCar)
router.route("/delete").delete(deleteCar)


export default router