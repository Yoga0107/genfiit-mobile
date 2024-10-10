import axios from "axios";

const ApiManager = axios.create({
    // baseURL: 'http://192.168.1.10:8000/api',
    // baseURL: 'http://192.168.169.115:8000/api',
    // baseURL: 'https://absensi-dev.sakainovasi.co.id/api',
    baseURL: 'https://api-genfiit.yanginibeda.web.id/api',
    responseType: 'json',
    withCredentials: false,
})

export default ApiManager;