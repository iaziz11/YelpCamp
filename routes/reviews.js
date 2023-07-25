const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const reviews = require('../controllers/reviews');
const { isLoggedIn, validateReview, isReviewOwner } = require('../middleware');

router.post('/', isLoggedIn, validateReview, wrapAsync(reviews.addReview))

router.delete('/:reviewId', isLoggedIn, isReviewOwner, wrapAsync(reviews.deleteReview))

module.exports = router;