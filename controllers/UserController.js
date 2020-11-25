const User = require("../model/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

//@desc Register user
//@route POST /api/v1/auth/register
//@accss Public
exports.register = asyncHandler(async(req, res, next) => {
    if (req.body.role === "admin") {
        req.body.role = "user"
    }
    const { name, email, password, role } = req.body;

    console.log(req.body);
    //Create user
    const user = await User.create({ name, email, password, role });
    sendTokenResponse(user, 200, res);

});

//@desc Login user
//@route POST /api/v1/auth/login
//@accss Public
exports.login = asyncHandler(async(req, res, next) => {
    const { email, password } = req.body;

    //Validate email and password
    if (!email || !password) {
        return next(new ErrorResponse('please provide an email and password', 400))
    }
    //Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401))
    }

    //Check if password match
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401))
    }

    sendTokenResponse(user, 200, res);

});


// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Public
exports.logout = asyncHandler(async(req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    });
});


//@desc  Get Organisation
//@route GET /api/v1/auth/organisation
//@accss private
exports.getOrganisation = asyncHandler(async(req, res, next) => {
    const organisation = await User.find({ role: 'organisation' });
    res.status(200).json({
        success: true,
        data: organisation
    })
});

//@desc  Get Organisation
//@route GET /api/v1/auth/organisation/information
//@accss private
exports.getOrganisationInformation = asyncHandler(async(req, res, next) => {
    const organisation = await User.find({ role: 'organisation' }).populate('organisation');
    res.status(200).json({
        success: true,
        data: organisation
    })
});