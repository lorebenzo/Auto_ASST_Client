import Router from 'vue-router';
import store from '../store/index'


// USER COMPONENENTS
import SelectCar from '../components/Utente/SelectCar/SelectCar';
import Home from '../components/Utente/Home'
import Login from '../components/Utente/Login/Login';
import ViaggiViewerAndLoader from '../components/Utente/Viaggi/ViaggiViewerAndLoader';
import ViaggioInformation from '../components/Utente/Viaggi/ViaggioInformation';
import SelectViaggi from '../components/Utente/Viaggi/SelectViaggi';
import Comunicazioni from '../components/Utente/Comunicazioni/Comunicazioni'
import Segnalazioni from '../components/Utente/Segnalazioni/Segnalazioni'
import PannelloUtente from '../components/Utente/PannelloUtente/PannelloUtente'

// ADMIN COMPONENTS
import AdminHome from '../components/Admin/AdminHome';
import ComunicazioniAdmin from '../components/Admin/Comunicazioni/ComunicazioniAdmin'
import Macchine from '../components/Admin/Macchine/Macchine'



const ifNotAuthenticated = (to, from, next) => {
    if (!store.getters.isAuthenticated) {
        return next()
    }
    next('/app');
}

const ifAdmin = (to, from, next) => {
    if (store.getters.isAdmin)
        return next()
    next('/app');
}

const ifAuthenticated = (to, from, next) => {
    if (store.getters.isAuthenticated) {
        return next()
    }
    next('/login')
}

const routes = [
    { path: '/', redirect: '/app' },
    {
        path: '/app', component: Home, beforeEnter: ifAuthenticated,
        children: [
            { path: 'selezione-macchine', component: SelectCar },
            {
                path: 'viaggi', component: ViaggiViewerAndLoader, children: [
                    { path: '', component: SelectViaggi },
                    { path: 'dettaglio/:id', component: ViaggioInformation }
                ]
            },
            { path: 'comunicazioni', component: Comunicazioni },
            { path: 'user-panel', component: PannelloUtente },
            { path: 'segnalazioni', component: Segnalazioni }
        ]
    },
    { path: '/login', component: Login, beforeEnter: ifNotAuthenticated },
    {
        path: '/admin', component: AdminHome, beforeEnter: ifAdmin, children: [
            { path: 'selezione-macchine', component: SelectCar },
            {
                path: 'viaggi', component: ViaggiViewerAndLoader, children: [
                    { path: '', component: SelectViaggi },
                    { path: 'dettaglio/:id', component: ViaggioInformation }
                ]
            },
            { path: 'comunicazioni', component: ComunicazioniAdmin },
            { path: 'macchine', component: Macchine }
        ]
    },
    { path: '*', redirect: '/app' }
]

export default new Router({
    mode: 'history',
    base: __dirname,
    routes,
});