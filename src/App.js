import './App.css';
import Search from "./components/search/search";
import CurrentWeather from "./components/current-weather/current-weather";
import {WEATHER_API_URL, WEATHER_API_KEY} from "./api"
import {useState} from "react";

function App() {

    // Creamos dos hooks, para el tiempo actual y para la previsión
    const [currentWeather, setCurrentWeather] = useState(null)
    const [forecast, setForecast] = useState(null);

    const handleOnSearchChange = (searchData) => {

        // Nos guardamos la latitud y la longitud de la ciudad que hayamos seleccionado
        const [lat, lon] = searchData.value.split(" ");

        // Hacemos las peticiones del tiempo actual y de la previsión
        const currentWeatherFetch = fetch(
            `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
        );
        const forecastFetch = fetch(
            `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
        );

        // Una vez tenemos las respuestas de las peticiones actualizamos nuestras constantes
        Promise.all([currentWeatherFetch, forecastFetch])
            .then(async (response) => {
                const weatherResponse = await response[0].json();
                const forecastResponse = await response[1].json();

                setCurrentWeather({city: searchData.label, ...weatherResponse});
                setForecast({city: searchData.label, ...forecastResponse});
            })
            .catch((err) => console.log(err));
    };

    console.log(currentWeather);
    console.log(forecast);

  return (
    <div className="container">
        <Search onSearchChange={handleOnSearchChange}/>
        {currentWeather && <CurrentWeather data={currentWeather}/>}
    </div>
  );
}

export default App;
