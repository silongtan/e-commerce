import axios from 'axios';

axios.defaults.baseUrl = 'http://localhost:8081/';
axios.defaults.headers.common['Authorization'] =
  'Bearer ' + localStorage.getItem('token');
