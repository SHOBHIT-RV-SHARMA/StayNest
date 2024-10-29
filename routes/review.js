const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utilities/wrapAsync.js");
const ExpressError = require("../utilities/ExpressError.js");
const {ReviewSchema} = require("../Server_SIde_Validation.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const validateReview = (req,res,next) => {
    let {error} = ReviewSchema.validate(req.body);
  
    if(error){
      let errMsg = error.details.map((el) => el.message).join(","); // ask gpt what does this line do 
      throw new ExpressError(404 , errMsg);
    }else{
      next();
    }
}

// Reviews
// Post Route

router.post("/", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
  
    let newReview = new Review(req.body.review);
  
    listing.reviews.push(newReview);
  
    await newReview.save();
    await listing.save();
  
    res.redirect(`/listings/${listing._id}`);
}));
  
  // delete Review
  
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
  
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
  
    res.redirect(`/listings/${id}`);
}));  

module.exports = router ;