const express = require("express");
const {
    getReviews,
    getReview,
    createReview,
    updateReview,
    getMyReview
} = require('../controllers/ReviewController');
const router = express.Router();
const Review = require('../model/Review');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.route('/').get(advancedResults(Review), getReviews).post(protect, createReview);
router.route('/validate').get(protect, getReview);
router.route('/user').get(protect, getMyReview);
router.route('/:id').put(protect, updateReview);

module.exports = router;