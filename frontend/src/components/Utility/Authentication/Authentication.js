import axios from 'axios';
import Cookies from 'js-cookie';

const env = process.env.REACT_APP_ENVIRONMENT;
const backendUrl = env === 'development' ? process.env.REACT_APP_DEV_BACKEND_URL : '';

const getCSRFToken = () => Cookies.get('csrftoken') || "";

function LoginAPI(body){
    return axios.post(`${backendUrl}/auth/login/`, 
        body,
        {
            headers: {
                'X-CSRFToken': getCSRFToken(),
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }
    ).then((res) => res.data).catch((err) => {
        console.log(err);
    });
}

function SigninAPI(body){
    return axios.post(`${backendUrl}/auth/signup/`, 
        body,
        {
            headers: {
                'X-CSRFToken': getCSRFToken(),
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }
    ).then((res) => res.data).catch((err) => {
        console.log(err);
    });
}

function LogoutAPI(){
    return axios.get(`${backendUrl}/auth/logout/`,
        {
            headers: {
                'X-CSRFToken': getCSRFToken(),
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }
    ).then((res) => res.data).catch((err) => {
        console.log(err);
    });
}

export { LoginAPI, SigninAPI, LogoutAPI, getCSRFToken };