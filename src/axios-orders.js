import axios from 'axios'

const instance = axios.create({
    baseURL:'https://burger-builder-eb32e-default-rtdb.firebaseio.com/',

});

export default instance