import {AsyncPaginate} from "react-select-async-paginate";
import {useState} from "react";
import {GEO_API_URL, geoApiOptions} from "../../api";

const Search = ({onSearchChange}) => {

    // Creamos un hook para lo que buscamos
    // let lastSearchValue = localStorage.getItem('lastSearch');
    const [search, setSearch] = useState('');
    // console.log(lastSearchValue);

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

    // loadOptions(lastSearchValue);

    // Función para manejar los cambios de búsqueda
    const handleOnChange = (searchData) => {
        setSearch(searchData);
        // let lastSearchValue = searchData.label.split(",")[0];
        // localStorage.setItem('lastSearch', lastSearchValue);
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