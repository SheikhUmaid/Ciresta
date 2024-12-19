import ApiError from "../utils/util.apiError.js";
import asyncHandler from "../utils/util.asyncHandler.js";
import Booking from "../models/booking.model.js";
import Car from "../models/car.model.js";
import ApiResponse from "../utils/util.apiResponse.js";
import Transaction from "../models/transaction.model.js"
const createBooking = asyncHandler(async (req, res) => {
	const user = req.user;
	const { carId, days, bookingName } = req.body;
	if (!user) {
		throw new ApiError(404, "LoggedIn user not found");
	}

	if (!carId) {
		throw new ApiError(500, "car Id is required");
	}

	if (!days) {
		throw new ApiError(500, "Number of Days is required");
	}

    const car = await Car.findById(carId);

	if (!car) {
		throw new ApiError(404, "Car not found");
	}

	const booking = await Booking.create({
		user: user._id,
		car: car._id,
		days: days,
		bookingName:bookingName
	});

	if (!booking) {
        throw new ApiError(500, "Something went Wrong Creating a Booking");
	}

    const transactionPrice = car.rentPrice * booking.days;
    const transaction = await Transaction.create({
        booking: booking._id,
        transactionPrice: transactionPrice,
    });

    if(!transaction){
        throw new ApiError(500, "Somthing went wrong in creating transaction")
    }

	res.status(201).json(
		new ApiResponse(201, booking, "Successfully Created Booking"),
	);
});

const cancelBooking = asyncHandler(async (req, res) => {
	const user = req.user;
	const { bookingId } = req.body;
	if (!user) {
		throw new ApiError(404, "LoggedIn user not found");
	}

	if (!bookingId) {
		throw new ApiError(500, "Booking Id is Required");
	}

	const booking = await Booking.findById(bookingId);

	if (!booking) {
		throw new ApiError(404, "No booking found");
	}

	if (booking.user.toString() !== user._id.toString()) {
		console.log(typeof booking.user);
		console.log(typeof user._id);

		throw new ApiError(401, "Not Authorized to perform this action");
	}
	try {
		await booking.deleteOne();
	} catch (err) {
		console.log(err);

		throw new ApiError(500, "Something went wrong while deleting", err);
	}

	return res
		.status(200)
		.json(new ApiResponse(200, {}, "Successfully deleted the booking"));
});

export { createBooking, cancelBooking };
