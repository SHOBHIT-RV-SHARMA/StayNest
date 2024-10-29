const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },    
    description : String,
    image : {
        type : String,
        default :
           "https://unsplash.com/photos/an-image-of-a-star-cluster-in-the-sky-o9PTdUxitkY",
        set: (v) => 
            v === ""
              ?"https://unsplash.com/photos/an-image-of-a-star-cluster-in-the-sky-o9PTdUxitkY" 
              : v,
    },
    price : Number,
    location : String,
    country : String,
    reviews : [
        {
           type : Schema.Types.ObjectId,
           ref : "Review",
        },
    ],    
});

listingSchema.post("findOneAndDelete", async (listing) => {    

    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }

});

/* 
   it means that whenever findOneAndDelete takes place
   in Listing collection then delete all the reviews 
   inside Review collection which are related or matched 
   to the Listing id which is going to  deleted 
*/

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;