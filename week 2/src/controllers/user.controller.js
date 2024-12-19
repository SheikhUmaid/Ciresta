import User from "../models/user.model.js";
import ApiError from "../utils/util.apiError.js";
import asyncHandler from "../utils/util.asyncHandler.js";
import ApiResponse from "../utils/util.apiResponse.js";
import cookieOptions from "../utils/util.cookieOptions.js";





const generateAccessAndRefreshTokens = async(userId)=>{
    try{
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
		console.log("Gen Accesstoken", accessToken);
		
        const refreshToken = await user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})
        return {accessToken, refreshToken}
    }catch (error){
        throw new ApiError(500, "something went wrong while generating tokens")
    }
}



const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	if ([email, password, name].some((field) => field.trim() === "")) {
		throw new ApiError(400, "All fields are required");
	}

	const userExists = await User.findOne({
		email,
	});

	if (userExists) {
		throw new ApiError(409, "User Already Exists");
	}

	const createdUser = await User.create({
		name,
		email,
		password,
	});

	if (!createdUser) {
		throw new ApiError(500, "Something went wrong while registering User");
	}

	const user = await User.findById(createdUser._id).select(
		"-password -refreshToken",
	);

	return res
		.status(201)
		.json(new ApiResponse(201, user, "User created Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		throw new ApiError(500, "email and password is required");
	}

	const user = await User.findOne({
		email,
	});

	if (!user) {
		throw new ApiError(404, "User Not Found");
	}
	const isPasswordCorrect =  await user.isPasswordCorrect(password)
	
	if (!isPasswordCorrect) {
		throw new ApiError(405, "Invalid Credentials");
	}

	const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
		user._id,
	);

	console.log("accessToken:" ,accessToken);
	

	const loggedInUser = await User.findById(user._id);

	req.loggedInUser = loggedInUser;

	return res
		.status(200)
		.cookie("accessToken", accessToken, cookieOptions)
		.cookie("refreshToken", refreshToken, cookieOptions)
		.json(
			new ApiResponse(
				200,
				{
					loggedInUser: loggedInUser,
					refreshToken: refreshToken,
					accessToken: accessToken,
				},
				"User logged in successfully",
			),
		);
});



const refreshAccessToken = asyncHandler(async (req,res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401, "unauthorized request")
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESHTOKEN)
        const user = await User.findById(decodedToken._id)
        if(!user){
            throw new ApiError(401, "Invalid refresh token")
        }
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "refresh token expired or used")
        }
    
        const {accessToken, refreshtoken} = await generateAccessAndRefreshTokens(user._id)
    
        res.status(200).
        cookie("accessToken",accessToken, cookieOptions).
        cookie("refreshToken",refreshtoken, cookieOptions).
        json(
            new ApiResponse(
                200,
                {accessToken, refreshtoken},
                "new access token generated"
            )
        )
    } catch (error) {
        throw  new ApiError(401, "Invalid refresh token ")
    }
})



const logoutUser = asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,{
            $set:{
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    return res.
    status(200).
    clearCookie("accessToken", cookieOptions).
    clearCookie("refreshToken", cookieOptions).
    json(new ApiResponse(200, {}, "Logged out succcessfully"))
})



export { registerUser, loginUser, logoutUser, refreshAccessToken };
