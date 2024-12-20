const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/wrapAsync.js");
const ExpressError = require("../utilities/ExpressError.js");
const {ListingSchema} = require("../Server_SIde_Validation.js");
const Listing = require("../models/listing.js");


const validateListing = (req,res,next) => {
    let {error} = ListingSchema.validate(req.body);
  
    if(error){
      let errMsg = error.details.map((el) => el.message).join(","); // ask gpt what does this line do 
      throw new ExpressError(404 , errMsg);
    }
    else{
      next();
    }
  }


//Index Route
router.get("/", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  });
  
  //New Route
  router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
  });
  
  //Show Route
  router.get("/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error" , "Listing does not exist ");
        res.redirect("/listings");
    }
    //console.log(listing);
    res.render("listings/show.ejs", { listing });
  });
  
  //Create Route
  router.post("/", validateListing, wrapAsync(async (req, res ,next) => {
      const newListing = new Listing(req.body.listing);
      await newListing.save();
      req.flash("success" , "New Listing Created");
      res.redirect("/listings");
     
  }));
  
  //Edit Route
  router.get("/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  });
  
  //Update Route
  router.put("/:id", validateListing, async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success" , "Listing Updated");
    res.redirect(`/listings/${id}`);
  });
  
  //Delete Route
  router.delete("/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success" , " Listing Deleted");
    res.redirect("/listings");
  });
 

  module.exports = router ;