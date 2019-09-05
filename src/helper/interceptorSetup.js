
import axios from 'axios';
import router from '../router/router';
import store from '../store/index.js'

export default function setup() {

    axios.defaults.baseURL = 'http://localhost:3000'

    axios.interceptors.request.use(
        (config) => {
            if (config.url != '/user/refresh-token') {
                var user = JSON.parse(localStorage.getItem('user'));

                if (user) {
                    config.headers['Authorization'] = `${user.token}`;
                }
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    //Interceptor AXIOS per fare il refresh del token
    const interceptor = axios.interceptors.response.use(response => {
        return response;
    }, async error => {
        const { config } = error;
        const originalRequest = config;
        if (error.response.status === 403) {
            axios.interceptors.response.eject(interceptor);
            var user = JSON.parse(localStorage.getItem('user'));
            if (user)
                axios.defaults.headers['Authorization'] = user.refresh_token;
            return axios.get('/user/refresh-token')
                .then((response) => {
                    localStorage.setItem('user', JSON.stringify(response.data));
                    //Riprovo la richiesta originale
                    originalRequest.headers['Authorization'] = response.data.token;
                    return axios(originalRequest);
                })
                .catch((err) => {
                    if (err.response.status != 403)
                        return Promise.reject(err);
                    else {
                        store.dispatch('logout');
                        router.push('/login');
                        return Promise.reject(err);

                    }
                })
                .finally(setup);
        }
        //  return Promise.reject();
    });


}
