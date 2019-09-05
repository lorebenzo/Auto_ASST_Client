import axios from 'axios';


let state = {
    segnalazioni: []
};

const actions = {
    fetchSegnalazioni({ commit }) {
        return new Promise(async (resolve, reject) => {
            try {
                var response = await axios.get(`/segnalazioni`);
                commit('setSegnalazioni', response.data.segnalazioni);
            } catch (err) {
                reject(err);
            }
        })
    }
}


const mutations = {
    setSegnalazioni(state, segnalazioni) {
        state.segnalazioni = segnalazioni;
    }
}

const getters = {
    getSegnalazioni: state => state.segnalazioni
}



export default {
    state,
    getters,
    actions,
    mutations
}