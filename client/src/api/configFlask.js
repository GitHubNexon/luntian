export let API_BASE_URL = null;
// for flask 

switch (process.env.NODE_ENV) {
  // to run or buld sandbox environment change port to 5000 and add /api-sandbox
  // API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:5000/api`;
  // API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:5000/api-sandbox`;
  // your local development api endpoint
  case "development":
    API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:5000/api`;
    console.log('API Base URL:', API_BASE_URL);
    break;
  case "production":
    // deployment server api url add /sandbox before building sandbox mode
    API_BASE_URL = `${window.location.protocol}//${window.location.hostname}/api`;
    // API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:5000/api-sandbox`;
    break;
}
