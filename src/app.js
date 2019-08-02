const path = require('path')
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000
// Define paths for express config
const publicDirectorypath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and view location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectorypath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Vikas'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Vikas'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text',
        title: 'Help',
        name: 'Vikas'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address, (error, {lattitude, longitude, location} = {}) => {
        if (error) {
            return res.send({ error });
        }

        forecast(lattitude, longitude, (error, forecastData) => {
            if(error) {
                return res.send({ error });
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })

        
    })

    // res.send({
    //     forecast: 'it is snowing',
    //     location: 'bangalore',
    //     address: req.query.address
    // })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 404,
        name: 'Vikas',
        errorMessage: 'Help article not found'       
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: 404,
        name: 'Vikas',
        errorMessage: 'Page not found'
    })
})

app.listen(port, () => {
    console.log('Server started on port ' + port)
})