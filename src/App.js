import './App.css';
import {useEffect, useState} from "react";
import Search from "./components/search/search";
import CurrentWeather from "./components/current-weather/current-weather";
import Forecast from "./components/forecast/forecast";
import {WEATHER_API_URL, WEATHER_API_KEY} from "./api";

function App() {

    // Funcion para buscar la localizacion del dispositivo
    const searchInitialValue = {
        label: '',
        value: ''
    }
    const searchActualLocation = () => {
        return fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                const city = data.city;
                const country_code = data.country_code;
                const latitude = data.latitude;
                const longitude = data.longitude;

                searchInitialValue.label = city + ', ' + country_code;
                searchInitialValue.value = latitude + ' ' + longitude;
            })
            .catch(err => console.error(err));
    }

    useEffect(() => {
        searchActualLocation().then(() => {
            handleOnSearchChange(searchInitialValue);
        });
    }, []);



    // Creamos dos hooks, para el tiempo actual y para la previsión
    const [currentWeather, setCurrentWeather] = useState(null)
    const [forecast, setForecast] = useState(null);

    // Esta función se la pasaremos como propiedad al componente de Search cada vez que se produzca un cambio en la búsqueda
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

  return (
    <div className="container">
        <Search onSearchChange={handleOnSearchChange} />
        {currentWeather && <CurrentWeather data={currentWeather} />}
        {forecast && <Forecast data={forecast}/>}
    </div>
  );
}

export default App;
