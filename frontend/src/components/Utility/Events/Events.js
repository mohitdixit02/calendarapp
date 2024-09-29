import axios from 'axios';
import { getCSRFToken } from '../Authentication/Authentication';

const env = process.env.REACT_APP_ENVIRONMENT;
const backendUrl = env === 'development' ? process.env.REACT_APP_DEV_BACKEND_URL : '';

function createEventAPI(body){
    return axios.post(`${backendUrl}/event/create_event/`, 
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

function getEventsYM_API(body){
    return axios.post(`${backendUrl}/event/get_events_ym/`, 
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

function getEvents_M_COUNT_API(body){
    return axios.post(`${backendUrl}/event/get_events_m_count/`, 
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

function getEvents_All_API(){
    return axios.get(`${backendUrl}/event/get_events_all/`,
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

function getEvents_upcoming_API(){
    return axios.get(`${backendUrl}/event/get_events_upcoming/`,
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

function deleteEventAPI(body){
    return axios.post(`${backendUrl}/event/delete_event/`, 
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

function updateEventAPI(body){
    return axios.post(`${backendUrl}/event/update_event/`, 
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

function deleteAllEventsAPI(body){
    return axios.post(`${backendUrl}/event/delete_all_events/`, 
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

export { 
    createEventAPI,
    getEventsYM_API,
    deleteEventAPI,
    updateEventAPI,
    deleteAllEventsAPI,
    getEvents_M_COUNT_API,
    getEvents_All_API,
    getEvents_upcoming_API,
};