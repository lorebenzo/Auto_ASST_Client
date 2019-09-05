import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000'

const state = {
    userInfo: {}
}

const getters = {
    getInformazioniUtente(state) {
        return state.userInfo;
    }
}

const actions = {
    fetchInformazioniUtente({ commit }) {
        return new Promise(async (resolve, reject) => {
            try {
                var response = await axios.get('/user/informazioni-utente');
                var { informazioni } = response.data;
                commit('setInformazioniUtente', informazioni);
                resolve();
            } catch (err) {
                reject(err);
            }
        })
    },
    changeEmail({ commit }, { nuovaEmail, password }) {
        return new Promise(async (resolve, reject) => {
            try {
                var response = await axios.put('/user/email', { email: state.userInfo.email, nuovaEmail, password });
                commit('setNuovaEmail', nuovaEmail);
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    },
    changePassword({commit}, {password, nuovaPassword}){
        return new Promise(async (resolve, reject) => {
            try {
                var response = await axios.put('/user/email', { nuovaPassword, password });
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }
}

const mutations = {
    setInformazioniUtente(state, informazioni) {
        state.userInfo = informazioni;
    },
    setNuovaEmail(state, nuovaEmail) {
        state.userInfo.email = nuovaEmail;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}