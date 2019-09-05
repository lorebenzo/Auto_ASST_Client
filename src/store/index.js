import Vuex from 'vuex';
import Vue from 'vue';

//Modules
import car from './modules/car-vuex-module';
import auth from './modules/authentication-module';
import viaggi from './modules/viaggi-vuex-module';
import comunicazioni from './modules/comunicazioni-vuex-module';
import segnalazioni from './modules/segnalazioni-vuex-module';
import user from './modules/user-vuex-module';

import interceptorSetup from '../helper/interceptorSetup'

interceptorSetup();

// Load Vuex
Vue.use(Vuex);

// Create store
export default new Vuex.Store({
  modules: {
    car,
    auth,
    viaggi,
    comunicazioni,
    user,
    segnalazioni
  }
});