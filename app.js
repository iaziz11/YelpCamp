const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const morgan = require('morgan');
const flash = require('connect-flash');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const ExpressError = require('./utils/ExpressError');
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database Connected');
})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate)
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

const sessionConfig = {
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = 'Something went wrong!';
    }
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log('Connected to server')
})