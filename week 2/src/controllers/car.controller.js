import Car from "../models/car.model.js";
import ApiError from "../utils/util.apiError.js";
import asyncHandler from "../utils/util.asyncHandler.js";
import ApiResponse from "../utils/util.apiResponse.js"


const createCar = asyncHandler(async (req,res) => {
    const {carType, brand, model, price} = req.body;
    if ([carType, brand, model].some((el)=> el.trim() === "")){
        throw new ApiError(401, "brand, model, price, carType is required");
    }

    const car = await Car.create({
        carType, brand, model, price
    });


    if(!car){
        throw new ApiError(500, "Something went wrong creating Car");
    }

    return res.status(201).json(
        new ApiResponse(201, car, "Car Added Successfully")
    )

})




const deleteCar = asyncHandler(async (req,res)=>{
    const {carId} = req.body;

    if(!carId)
        throw new ApiError(500,"Car Id is required to Delete car");

    const car = await Car.findByIdAndDelete(carId);

    if (!car){
        throw new ApiError(404, "unable to find the car",)

    }
    return res.status(204).json(new ApiResponse(204,{}, "Deleted Successfully"))     
})


const carSearch = asyncHandler(async (req, res) => {
    // Extract query parameters with default values
    const { 
        carType, 
        brand, 
        minPrice, 
        maxPrice, 
        page = 1, 
        limit = 10, 
        sortBy = 'createdAt', 
        sortOrder = 'desc' 
    } = req.query;

    // Build dynamic filter object
    const filter = {};

    // Add car type filter if provided
    if (carType) {
        filter.carType = { 
            $regex: new RegExp(carType, 'i') 
        };
    }

    // Add brand filter if provided
    if (brand) {
        filter.brand = { 
            $regex: new RegExp(brand, 'i') 
        };
    }

    // Add price range filter
    const priceFilter = {};
    if (minPrice) {
        priceFilter.$gte = Number(minPrice);
    }
    if (maxPrice) {
        priceFilter.$lte = Number(maxPrice);
    }
    if (Object.keys(priceFilter).length > 0) {
        filter.price = priceFilter;
    }

    // Validate and sanitize pagination parameters
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNumber - 1) * limitNumber;

    // Validate sort parameters
    const validSortFields = ['carType', 'brand', 'price', 'createdAt'];
    const validSortOrders = ['asc', 'desc'];

    const sanitizedSortBy = validSortFields.includes(sortBy) 
        ? sortBy 
        : 'createdAt';
    
    const sanitizedSortOrder = validSortOrders.includes(sortOrder.toLowerCase()) 
        ? sortOrder.toLowerCase() 
        : 'desc';

    // Construct sort object
    const sort = { [sanitizedSortBy]: sanitizedSortOrder === 'asc' ? 1 : -1 };

    try {
        // Perform parallel queries for data and total count
        const [cars, totalCars] = await Promise.all([
            Car.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limitNumber)
                .select('-__v') // Exclude version key
                .lean(), // Convert to plain JavaScript object for performance
            Car.countDocuments(filter)
        ]);

        // Check if no cars found
        if (cars.length === 0) {
            return res.status(200).json(
                new ApiResponse(200, {
                    cars: [],
                    pagination: {
                        total: 0,
                        page: pageNumber,
                        limit: limitNumber,
                        totalPages: 0
                    }
                }, "No cars found matching the search criteria")
            );
        }

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalCars / limitNumber);

        // Return successful response
        return res.status(200).json(
            new ApiResponse(200, {
                cars,
                pagination: {
                    total: totalCars,
                    page: pageNumber,
                    limit: limitNumber,
                    totalPages
                }
            }, "Cars retrieved successfully")
        );

    } catch (error) {
        // Handle any unexpected errors
        throw new ApiError(500, "Error searching for cars", [error.message]);
    }
});
export {createCar, deleteCar,carSearch}