const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const Campground = require('../models/campground');
const { isLoggedIn, validateCampground, isOwner } = require('../middleware');


router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
})

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
})

router.get('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate(
        {
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author');
    if (!campground) {
        req.flash('error', 'Campground not found!');
        res.redirect('/campgrounds');
    } else {
        res.render('campgrounds/show', { campground });
    }
}))

router.post('/', isLoggedIn, validateCampground, wrapAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Campground not found!');
        res.redirect('/campgrounds');
    } else {
        res.render('campgrounds/edit', { campground })
    }
}))

router.put('/:id', isLoggedIn, isOwner, validateCampground, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const newData = req.body.campground;
    await Campground.findByIdAndUpdate(id, newData, { new: true, runValidators: true });
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${id}`);
}))

router.delete('/:id', isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id).populate('author');
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}))


module.exports = router;