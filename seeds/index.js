const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Seed Database Connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const price = Math.floor(Math.random() * 20) + 10
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [{
                url: 'https://res.cloudinary.com/dywo0yuvm/image/upload/v1690249541/YelpCamp/aoqkfize9w1pgo5k854u.jpg',
                filename: 'YelpCamp/aoqkfize9w1pgo5k854u'
            },
            {
                url: 'https://res.cloudinary.com/dywo0yuvm/image/upload/v1690249541/YelpCamp/v0gyswpeimjfj5ta4xvc.jpg',
                filename: 'YelpCamp/v0gyswpeimjfj5ta4xvc'
            }],
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum enim exercitationem nisi, recusandae reiciendis, numquam eveniet rerum quaerat adipisci repellendus tempore nostrum quisquam fugit quibusdam doloribus sed est perferendis nemo.',
            price,
            author: '64b9a6775e6f1dfa75e68bfb'
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})