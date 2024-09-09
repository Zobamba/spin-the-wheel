import axios from 'axios';

const BASE_URL = 'https://spottrbackendapiv2.azurewebsites.net';

export default axios.create({
  baseURL: BASE_URL,
});
