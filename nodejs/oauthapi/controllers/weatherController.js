import axios from 'axios';
import catchAsync from '../utility/catchAsync.js';

class WeatherController {
    constructor() {
        this.WEATHER_SERVICE_API_KEY = process.env.WEATHER_SERVICE_API_KEY; 
    }

    index = catchAsync(async (req, res, next) => {
        const city = req.query.city || 'Dallas'; // Default to London if no city is specified
        const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.WEATHER_SERVICE_API_KEY}&units=metric`;
        try {
            const response = await axios.get(weatherApiUrl);
            const data = response.data;
            if (data.cod !== 200) {
                //return res.status(data.cod).json({ error: data.message });
                return res.status(data.cod).json({
                    status: 'fail',
                    message: data.message
                });
            }
          
            res.status(200).json({
                status: 'success',
                data: {
                    city: data.name,
                    temperature: data.main.temp,
                    description: data.weather[0].description,
                    humidity: data.main.humidity,
                    windSpeed: data.wind.speed,
                }
              });
        } catch (error) {
            next(error);
        }
    });
}

export default WeatherController;
