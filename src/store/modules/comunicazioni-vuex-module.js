import axios from 'axios';

let state = {
    comunicazioni: []
};

const actions = {
    fetchComunicazioni({ commit }) {
        return new Promise(async (resolve, reject) => {
            try {
                var response = await axios.get(`/comunicazioni`);
                commit('setComunicazioni', response.data.comunicazioni);
            } catch (err) {
                reject(err);
            }
        })
    },
    commitComunicazione({ commit }, { comunicazione, tipologia }) {
        return new Promise(async (resolve, reject) => {
            try {
                await axios.post(`/comunicazioni`, { comunicazione, tipologia });
                resolve();
            } catch (err) {
                reject(err);
            }
        })
    }
}


const mutations = {
    setComunicazioni(state, comunicazioni) {
        state.comunicazioni = comunicazioni;
    }
}

const getters = {
    getComunicazioni: state => state.comunicazioni
}



export default {
    state,
    getters,
    actions,
    mutations
}