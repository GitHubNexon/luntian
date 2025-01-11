export let API_BASE_URL = null;

switch (process.env.NODE_ENV) {
  // to run or buld sandbox environment change port to 3001 and add /api-sandbox
  // API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:3000/api`;
  // API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:3001/api-sandbox`;
  // your local development api endpoint
  case "development":
    API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:3000/api`;
    break;
  case "production":
    // deployment server api url add /sandbox before building sandbox mode
    API_BASE_URL = `${window.location.protocol}//${window.location.hostname}/api`;
    // API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:3001/api-sandbox`;
    break;
}
