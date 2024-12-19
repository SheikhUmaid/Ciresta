import app from "./src/app.js";
import ConnectToDB from "./src/database/connect.db.js";
import { PORT } from "./src/constants.js";
import Car from "./src/models/car.model.js";
const aa=[
    {
      "carType": "SUV",
      "brand": "Toyota",
      "model": "Rav4",
      "price": 30000,
      "rentPrice": 100
    },
    {
      "carType": "SUV",
      "brand": "Honda",
      "model": "CR-V",
      "price": 28000,
      "rentPrice": 90
    },
    {
      "carType": "Sedan",
      "brand": "Honda",
      "model": "Accord",
      "price": 25000,
      "rentPrice": 80
    },
    {
      "carType": "Sedan",
      "brand": "Toyota",
      "model": "Camry",
      "price": 24000,
      "rentPrice": 75
    },
    {
      "carType": "Hatchback",
      "brand": "Hyundai",
      "model": "i20",
      "price": 15000,
      "rentPrice": 50
    },
    {
      "carType": "Hatchback",
      "brand": "Ford",
      "model": "Fiesta",
      "price": 14000,
      "rentPrice": 45
    },
    {
      "carType": "Pickup",
      "brand": "Ford",
      "model": "F-150",
      "price": 40000,
      "rentPrice": 120
    },
    {
      "carType": "Pickup",
      "brand": "Chevrolet",
      "model": "Silverado",
      "price": 42000,
      "rentPrice": 130
    },
    {
      "carType": "Sports",
      "brand": "Porsche",
      "model": "911",
      "price": 120000,
      "rentPrice": 300
    },
    {
      "carType": "Sports",
      "brand": "Ferrari",
      "model": "488",
      "price": 250000,
      "rentPrice": 500
    },
    {
      "carType": "SUV",
      "brand": "BMW",
      "model": "X5",
      "price": 60000,
      "rentPrice": 200
    },
    {
      "carType": "Sedan",
      "brand": "Mercedes-Benz",
      "model": "C-Class",
      "price": 55000,
      "rentPrice": 180
    }
  ]
  


app.get("/",async (req,res)=>{
    await Car.deleteMany({});

    await Car.insertMany(aa)
    res.send("operation completed")
})
ConnectToDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("Server has started listening at port",PORT);
    })
}).catch((err)=>{
    console.log("Failed to connect to DB", err);
    process.exit(1);
});