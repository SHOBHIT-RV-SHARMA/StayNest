const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },    
    descripption : String,
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
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;