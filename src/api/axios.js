import axios from "axios"; 

const url = process.env.REACT_APP_JSON_SERVER_URL;
console.log("[debug] >>> ref env : " , url);

const api = axios.create({
    baseURL : 'http://localhost:8088',
    withCredentials : true 
});

export default api ; 
