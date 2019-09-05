import axios from 'axios'

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
    ? { status, user }
    : { status: null, user: null };


const state = initialState;

const actions = {
    async login({ commit }, { username, password }) {
        return new Promise(async (resolve, reject) => {
            try {
                commit('AUTH_REQUEST');
                var response = await axios.post('user/login', { username, password });
                commit('AUTH_SUCCESSFULL', response.data);
                resolve();
            } catch (err) {
                commit('AUTH_ERROR');
                reject();
            }
        })
    },
    // async changePassword({ commit }, { password, newPassword }) {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             var response = await axios.post('user/login', { password, newPassword });
    //             commit('AUTH_SUCCESSFULL', response.data);
    //             resolve();
    //         } catch (err) {
    //             reject(err);
    //         }
    //     })
    // },
    async logout({ commit }) {
        return new Promise((resolve) => {
            commit('AUTH_LOGOUT');
            resolve();
        });
    }
};

const getters = {
    getAuthStatus: state => state.status,
    isAuthenticated: state => !!state.user,
    isAdmin: state => {
        if (state.user) {
            if (state.user.isAdmin == 1)
                return true;
        }
        return false;
    }
}

const mutations = {
    AUTH_REQUEST: state => {
        state.status = 'loading'
    },
    AUTH_SUCCESSFULL(state, dati) {
        localStorage.setItem('user', JSON.stringify(dati));
        state.status = 'succes';
        state.user = dati;
    },
    AUTH_ERROR: state => {
        state.status = 'error';
        localStorage.removeItem('user');
    },
    AUTH_LOGOUT: state => {
        localStorage.removeItem('user');
        state.status = null;
        state.user = null;
    }
}

export default {
    state,
    actions,
    mutations,
    getters
}