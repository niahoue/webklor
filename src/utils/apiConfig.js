// Configuration centralisée de l'API
const API_BASE_URL = import.meta.env.MODE === 'development'? 'http://localhost:5000': 'https://webklor.onrender.com'; 

export default API_BASE_URL;