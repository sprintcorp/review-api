const Review = require("../model/Review");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

//@desc Get all reviews
//@route GET /api/v1/reviews
//@accss Public
exports.getReviews = asyncHandler(async(req, res, next) => {
    res.status(200).json(res.advancedResults);
});


//@desc Get reviews
//@route GET /api/v1/reviews/validate
//@accss Public
exports.getReview = asyncHandler(async(req, res, next) => {
    const review = await Review.find({
        $and: [{
            status: true
        }, {
            organisation: req.user.id
        }]
    });
    if (!review) {
        return next(
            new ErrorResponse(`review with this information not found`, 404)
        );
    }
    res.status(200).json({ success: true, data: review });
});

//@desc Get reviews
//@route GET /api/v1/reviews/user
//@accss Public
exports.getMyReview = asyncHandler(async(req, res, next) => {
    const review = await Review.find({
        user: req.user.id
    });
    if (!review) {
        return next(
            new ErrorResponse(`review not available`, 404)
        );
    }
    res.status(200).json({ success: true, data: review });
});

//@desc  Create new reviews
//@route POST /api/v1/reviews
//@accss Private
exports.createReview = asyncHandler(async(req, res, next) => {
    //Add user to req,body
    req.body.user = req.user.id;
    console.log(req.user.id);
    //if the user is not an admin,they can't add review
    if (req.user.role !== 'user') {
        return next(new ErrorResponse(`This user does not have access to this resource`, 401));
    }
    const review = await Review.create(req.body);
    res.status(201).json({ success: true, data: review });
});

//@desc Update reviews
//@route PUT /api/v1/reviews/:id
//@accss Private
exports.updateReview = asyncHandler(async(req, res, next) => {
    let review = await Review.findById(req.params.id);
    if (!review) {
        return next(
            new ErrorResponse(`review not found with id of ${req.params.id}`, 404)
        );
    }
    console.log(req.user);
    // Make ure user is an admin
    if (req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User is not authoried to update review`, 403)
        );
    }
    // req.body.status = 'true';
    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({ success: true, data: review });
});