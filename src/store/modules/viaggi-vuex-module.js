import axios from 'axios';

const state = {
    viaggi: [],
    lunghezzaPagination: 1,
    pagina: 1
}


const getters = {
    getViaggi: state => state.viaggi,
    getViaggio: state => idViaggio => {
        return state.viaggi.find((viaggio) => {
            return viaggio.idviaggio == idViaggio;
        })
    },
    getLunghezzaPagination: state => state.lunghezzaPagination,
    getPagina: state => state.pagina
}

const actions = {
    async fetchViaggi({ commit }, { itemsPerPagina }) {
        return new Promise(async (resolve, reject) => {
            try {
                var response = await axios.get(`/prenotazioni/viaggi?pagina=${state.pagina}&itemsPerPagina=${itemsPerPagina}`);
                var viaggi = response.data.viaggi;
                var lunghezza = response.data.lunghezza;
                commit('setViaggi', viaggi);
                commit('setLunghezza', lunghezza);
                resolve(lunghezza);
            } catch (err) {
                reject(err);
            }

        })
    },
    async deleteViaggio({ commit }, { idViaggio }) {
        return new Promise(async (resolve, reject) => {
            try {
                var response = await axios.delete(`prenotazioni/viaggi/${idViaggio}`);
                resolve(response);
            } catch (err) {
                reject(err);
            }
        })
    },
    async commitSegnalazione({ commit }, { idViaggio, segnalazione }) {
        return new Promise(async (resolve, reject) => {
            try {
                var response = await axios.post(`/segnalazioni`, { idViaggio, segnalazione });
                resolve(response);
            } catch (err) {
                reject(err);
            }
        })
    }
}

const mutations = {
    setViaggi(state, viaggi) {
        state.viaggi = viaggi;
    },
    setLunghezza: (state, lunghezzaPagination) => {
        state.lunghezzaPagination = lunghezzaPagination;
    },
    changePagina: (state, pagina) => {
        state.pagina = pagina;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}