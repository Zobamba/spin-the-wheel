import axios from 'axios';

// const BASE_URL = 'https://spottrbackendapiv2.azurewebsites.net';
const BASE_URL = 'https://delic-be.onrender.com';

export default axios.create({
  baseURL: BASE_URL
});
