import {AsyncPaginate} from "react-select-async-paginate";
import {useState} from "react";
import {GEO_API_URL, geoApiOptions} from "../../api";

const Search = ({onSearchChange}) => {

    const [search, setSearch] = useState(null);

    // Función para ir cargando las opciones conforme se vaya escribiendo mediante peticiones a la api
    const loadOptions = (inputValue) => {
        return fetch(`${GEO_API_URL}/cities?namePrefix=${inputValue}`, geoApiOptions)
            .then(response => response.json())
            .then(response => {
                return {
                    options: response.data.map((city) => {
                        return {
                            value: `${city.latitude} ${city.longitude}`,
                            label: `${city.name}, ${city.countryCode}`,
                        }
                    })
                }
            })
            .catch(err => console.error(err));
    }

    // Función para manejar los cambios de búsqueda
    const handleOnChange = (searchData) => {
        setSearch(searchData);
        onSearchChange(searchData);
    }

    return (
        // Componente importado
        <AsyncPaginate
            placeholder = "Search your city..."
            debounceTimeout = {600}
            value = {search}
            onChange = {handleOnChange}
            loadOptions = {loadOptions}
        />
    );
}

export default Search;