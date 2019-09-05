import axios from 'axios';

// axios.defaults.baseURL = 'http://localhost:3000'

// //Interceptor AXIOS per fare il refresh del token
// axios.interceptors.response.use(response => {
//     return response;
// }, async error => {
//     const { config } = error;
//     const originalRequest = config;
//     if (error.response.status === 403) {
//         var user = JSON.parse(localStorage.getItem('user'));
//         if (user)
//             axios.defaults.headers['Authorization'] = user.refresh_token;
//         var response = await axios.get('/user/refresh-token');
//         localStorage.setItem('user', JSON.stringify(response.data));

//         //Riprovo la richiesta originale
//         const retryOrigReq = new Promise((resolve) => {
//             originalRequest.headers['Authorization'] = response.data.token;
//             resolve(axios(originalRequest));
//         });
//         axios.defaults.headers['Authorization'] = user.token;
//         return retryOrigReq;
//     } else {
//         return Promise.reject(error);
//     }
// });

const state = {
    'sedi': [],
    'auto': [],
    'error': '',
    'sedePartenza': {},
    'macchinaSelezionata': '',
    'orarioPartenza': ''
};

const getters = {
    getSedi: state => {
        return state.sedi;
    },
    getAuto: state => {
        return state.auto;
    },
    getSedePartenza: state => {
        return state.sedePartenza;
    },
    getMacchinaSelezionata: state => {
        return state.macchinaSelezionata;
    },
    getOrarioPartenza: state => {
        return state.orarioPartenza;
    }
};

const actions = {
    async fetchSedi({ commit }) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.get('/prenotazioni/get-sedi');
                commit('setSedi', { sedi: response.data.sedi });
                resolve();
            } catch (err) {
                reject(err);
            }
        })
    },
    async fetchAuto({ commit }, dati) {
        return new Promise(async (resolve, reject) => {
            try {
                var idSede = dati.idSede;
                var data = dati.data;
                const response = await axios.post('/automobili/automobili-prenotazione', { idSede, data });
                if (response.status == 203) {
                    commit('setAuto', { auto: {} })
                    reject('Nessuna auto disponibile nella Sede selezionata')
                }
                commit('setAuto', { auto: response.data.orario });
                commit('setStazionePartenza', idSede);
                resolve();
            } catch (err) {
                reject('Errore durante il caricamento delle auto');
            }
        })
    },
    async commitOrario({ commit }, { spostamenti, soste, data, idSede }) {
        return new Promise(async (resolve, reject) => {
            try {
                spostamenti.forEach((spostamento, index) => {
                    // Se non è il primo
                    if (index != 0) {
                        // Se lo spostamento precedente ha avuto un arrivo fuori sede, imposto la partenza dello spostamento successivo
                        if (spostamenti[index - 1].arrivo.fuoriSede) {
                            spostamento.partenza.fuoriSede = true;
                            spostamento.partenza.indirizzo = spostamenti[index - 1].arrivo.indirizzo;
                        }
                        // La partenza dello spostamento combacia con l'arrivo dello spostamento precedente
                        spostamento.partenza.sede = spostamenti[index - 1].arrivo.sede;
                        spostamento.partenza.fuoriSede = spostamenti[index - 1].arrivo.fuoriSede
                    }
                    // Se è l'ultimo spostamento
                    if (index + 1 == spostamenti.length) {
                        // L'arrivo deve combaciare con la partenza
                        spostamento.arrivo.sede = spostamenti[0].partenza.sede;
                        spostamento.arrivo.fuoriSede = false;
                    }
                });


                await axios.post('prenotazioni/commit-orario', { spostamenti, soste, targa: state.macchinaSelezionata, data, idSede })
                commit('orarioCommitted');
                resolve();
            } catch (err) {
                reject(err);
            }
        })
    }
};

const mutations = {
    setSedi: (state, sedi) => {
        state.sedi = sedi;
    },
    setAuto: (state, auto) => {
        state.auto = auto;
    },
    setSedePartenza: (state, sedePartenza) => {
        state.sedePartenza = sedePartenza;
    },
    setMacchinaSelezionata: (state, dati) => {
        state.macchinaSelezionata = dati.macchinaSelezionata;
        state.orarioPartenza = dati.orarioPartenza;
    },
    orarioCommitted: (state) => {
        state.auto = [];
        state.sedePartenza = {},
            state.macchinaSelezionata = '';
        state.orarioPartenza = ''
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};