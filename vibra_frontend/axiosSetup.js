import axios from 'axios';

// Configure Axios interceptors for logging request and response bodies
axios.interceptors.request.use(
  (request) => {
    console.log('Request:', request);
    return request; // Must return the request to proceed
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response; // Must return the response to proceed
  },
  (error) => {
    console.error('Response Error:', error);
    return Promise.reject(error);
  }
);
