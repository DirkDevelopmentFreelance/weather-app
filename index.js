import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

const API_KEY = "d433511140b8144ed1a0bf1f2c463ee8";
const API_GEO_URL = "http://api.openweathermap.org/geo/1.0/direct";
const API_CURRENTWEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";

let isMetric = true;

let weatherData;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

let longitude;
let latitude;

app.use((req, res, next) => {
    if (req.redirected) {
        req.method = "POST";
        req.redirected = false;
    }
    next();
});

app.post("/location-info", async (req, res) => {
    try {
        const geocodeResponse = await axios.get(API_GEO_URL, {
            params: {
                q: req.body.location,
                appid: API_KEY,
            },
        });
        const geocodeResult = geocodeResponse.data;
        longitude = geocodeResult[0].lon;
        latitude = geocodeResult[0].lat;
        const currentWeatherResponse = await axios.get(API_CURRENTWEATHER_URL, {
            params: {
                lat: latitude,
                lon: longitude,
                units: isMetric ? "metric" : "imperial",
                appid: API_KEY,
            },
        });
        weatherData = currentWeatherResponse.data;
        res.render("index.ejs", {
            data: weatherData,
            unit: isMetric
        });
    } catch (error) {
        res.render("index.ejs", {
            error: error,
        });
    }
});

app.post("/toggle-unit", async (req, res) => {
    try {
        isMetric = !isMetric;
        const geocodeResponse = await axios.get(API_GEO_URL, {
            params: {
                q: req.body.location,
                appid: API_KEY,
            },
        });
        const geocodeResult = geocodeResponse.data;
        longitude = geocodeResult[0].lon;
        latitude = geocodeResult[0].lat;
        const currentWeatherResponse = await axios.get(API_CURRENTWEATHER_URL, {
            params: {
                lat: latitude,
                lon: longitude,
                units: isMetric ? "metric" : "imperial",
                appid: API_KEY,
            },
        });
        weatherData = currentWeatherResponse.data;
        res.render("index.ejs", {
            data: weatherData,
            unit: isMetric,
        });
    } catch (error) {
        res.render("index.ejs", {
            error: error,
        });
    }
});


app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});