<template>
  <div id="stepper">
    <v-stepper v-model="e1">
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" step="1" :editable="true">Scegli Stazione e Data</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="e1 > 2" step="2">Selezione Auto</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="3">Imposta Itinerario</v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
           <v-layout v-if="waiting" align-center justify-center column fill-height>
            <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
          </v-layout>
          <v-layout v-else align-center justify-center column fill-height>
            <v-alert v-if="alert" type="warning">{{alert}}</v-alert>
            <v-flex xs12 sm6 d-flex>
              <v-select
                :items="getSedi.sedi"
                return-object
                label="Sede"
                solo
                item-text="Comune"
                item-value="idSede"
                v-model="sedePartenza"
              ></v-select>
            </v-flex>
            <v-date-picker locale="italy" first-day-of-week="1" v-model="pickerData"></v-date-picker>
            <v-btn class="btn" color="primary" @click="moveToStep2">Avanti</v-btn>
          </v-layout>
        </v-stepper-content>

        <v-stepper-content step="2">
           <v-layout v-if="waiting" align-center justify-center column fill-height>
            <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
          </v-layout>
          <div v-else class="car-component">
            <carComponent
              v-on:move-step-3="moveToStep3"
              v-for="(auto, targa) in getAuto.auto"
              :key="targa"
              :targaAuto="targa"
            ></carComponent>
          </div>
        </v-stepper-content>

        <v-stepper-content step="3">
          <div class="spostamenti-stepper">
            <div class="container">
              <div class="spostamenti">
                <v-btn @click="aggiungiSpostamento">Aggiungi spostamento</v-btn>
                <div class="spostamento" v-for="(spostamento, index) in spostamenti" :key="index">
                  <!-- DELETE BUTTON -->
                  <v-btn
                    @click="spostamenti.splice(index,1)"
                    v-if="index != 0 && index+1 != spostamenti.length"
                    class="mx-2"
                    fab
                    dark
                    small
                    color="red"
                  >
                    <i class="fas fa-minus-circle"></i>
                  </v-btn>

                  <v-btn
                    v-if="index == 0 || index+1 == spostamenti.length"
                    class="mx-2"
                    fab
                    dark
                    disabled
                    small
                    color="grey"
                    style="visibility: hidden"
                  >
                    <i class="far fa-trash-alt"></i>
                  </v-btn>

                  <v-card class="card-spostamento">
                    <div class="info-spostamento">
                      <div class="partenza">
                        <div class="orario-pratenza">
                          <!-- PICKER ORARIO PARTENZA -->
                          <v-menu
                            ref="partenza"
                            v-model="spostamento.partenza.orariomodel"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            :return-value.sync="spostamento.partenza.orario"
                            transition="scale-transition"
                            offset-y
                            full-width
                            max-width="290px"
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                solo
                                v-model="spostamento.partenza.orario"
                                label="Partenza"
                                prepend-icon="access_time"
                                readonly
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-time-picker
                              v-if="spostamento.partenza.orariomodel"
                              :allowed-minutes="minutiConsentiti"
                              :min="calcolaTempoMinimoPartenza(index)"
                              :max="'21:00'"
                              format="24hr"
                              v-model="spostamento.partenza.orario"
                              full-width
                              @click:minute="$refs.partenza[index].save(spostamento.partenza.orario)"
                            ></v-time-picker>
                          </v-menu>
                        </div>
                        <div class="partenze">
                          <v-autocomplete
                            solo
                            color="#512da8"
                            item-color="#512da8"
                            v-if="index == 0"
                            label="Partenza"
                            item-text="Comune"
                            item-value="idSede"
                            disabled
                            :items="getSedi.sedi"
                            v-model="spostamento.partenza.sede"
                            return-object
                          ></v-autocomplete>

                          <!-- SE LO SPOSTAMENTO PRIMA DI ME E' FUORI SEDE E NON SONO LA PRIMA PARTENZA -->
                          <!-- PRENDO IL DATO DALLO SPOSTAMENTO PRECEDENTE (INDEX-1) NEL CAMPO COMUNE -->
                          <v-text-field
                            v-if="index != 0 && spostamenti[index-1].arrivo.fuoriSede"
                            solo
                            label="Partenza"
                            disabled
                            v-model="spostamenti[index-1].arrivo.indirizzo"
                          ></v-text-field>

                          <!-- SE LO SPOSTAMENTO PRIMA DI ME NON E' FUORI SEDE, E NON E' IL PRIMO UTILIZZO AUTO-COMPLETE DALLE SEDI -->
                          <v-autocomplete
                            v-if="index != 0 && !spostamenti[index-1].arrivo.fuoriSede"
                            solo
                            color="#512da8"
                            item-color="#512da8"
                            label="Partenza"
                            item-text="Comune"
                            item-value="idSede"
                            disabled
                            :items="getSedi.sedi"
                            v-model="spostamenti[index-1].arrivo.sede"
                            return-object
                          ></v-autocomplete>
                        </div>
                      </div>

                      <div class="arrivo">
                        <div class="orario-arrivo">
                          <!-- PICKER ORARIO ARRIVO -->
                          <v-menu
                            ref="arrivo"
                            v-model="spostamento.arrivo.orariomodel"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            :return-value.sync="spostamento.arrivo.orario"
                            transition="scale-transition"
                            offset-y
                            full-width
                            max-width="290px"
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                solo
                                v-model="spostamento.arrivo.orario"
                                label="Arrivo"
                                prepend-icon="access_time"
                                readonly
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-time-picker
                              v-if="spostamento.arrivo.orariomodel"
                              v-model="spostamento.arrivo.orario"
                              :allowed-minutes="minutiConsentiti"
                              :min="calcolaTempoMinimoArrivo(index)"
                              :max="'21:00'"
                              format="24hr"
                              full-width
                              @click:minute="$refs.arrivo[index].save(spostamento.arrivo.orario)"
                            ></v-time-picker>
                          </v-menu>
                        </div>

                        <!-- ARRIVI -->

                        <!-- SE E' LULTIMO, L'ARRIVO COINCIDE CON LA PARTENZA -->
                        <div class="arrivi">
                          <v-autocomplete
                            color="purple"
                            item-color="#512da8"
                            v-if="index+1 == spostamenti.length"
                            label="Arrivo"
                            solo
                            return-object
                            disabled
                            item-text="Comune"
                            item-value="idSede"
                            :items="getSedi.sedi"
                            v-model="spostamenti[0].partenza.sede"
                          ></v-autocomplete>

                          <!-- SE SPOSTAMENTO FUORI SEDE E NON E' L'ULTIMO SPOSTAMENTO -->
                          <v-text-field
                            v-if="spostamento.arrivo.fuoriSede && index+1 != spostamenti.length"
                            solo
                            return-object
                            color="purple"
                            label="Arrivo"
                            v-model="spostamento.arrivo.indirizzo"
                          ></v-text-field>

                          <v-autocomplete
                            v-if="!spostamento.arrivo.fuoriSede && index+1 != spostamenti.length"
                            label="Arrivo"
                            solo
                            return-object
                            color="#512da8"
                            item-color="#512da8"
                            item-text="Comune"
                            item-value="idSede"
                            :items="getSedi.sedi"
                            v-model="spostamento.arrivo.sede"
                          ></v-autocomplete>
                        </div>
                      </div>
                    </div>
                    <div class="fuori-sede">
                      <!-- CHECKBOX SEDE/FUORI SEDE -->
                      <v-checkbox
                        v-if="index+1 != spostamenti.length"
                        dark
                        color="512da8"
                        v-model="spostamento.arrivo.fuoriSede"
                        :label="'Fuori Sede'"
                      ></v-checkbox>
                      <!-- SE E' L'ULTIMO LO RENDO DISABLED -->
                      <v-checkbox
                        v-else
                        color="512da8"
                        dark
                        v-model="spostamento.arrivo.fuoriSede"
                        disabled
                        :label="'Fuori Sede'"
                      ></v-checkbox>
                    </div>
                  </v-card>
                </div>
              </div>
              <div class="soste">
                <v-btn @click="aggiungiSosta">Aggiungi Sosta</v-btn>
                <div v-for="(sosta, index) in soste" :key="index" class="sosta">
                  <v-card class="card-sosta">
                    <div class="info-sosta">
                      <div class="sede-sosta">
                        <v-select
                          :items="getSedi.sedi"
                          solo
                          return-object
                          label="Sede"
                          item-text="Comune"
                          item-value="idSede"
                          v-model="sosta.sedeSosta"
                        ></v-select>
                      </div>
                      <div class="orari-sosta">
                        <div class="inizio-sosta">
                          <v-menu
                            ref="inizio_sosta"
                            v-model="sosta.inizioSostaModel"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            :return-value.sync="sosta.inizioSosta.orario"
                            transition="scale-transition"
                            offset-y
                            full-width
                            max-width="290px"
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                solo
                                v-model="sosta.inizioSosta.orario"
                                label="Inizio"
                                prepend-icon="access_time"
                                readonly
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-time-picker
                              v-if="sosta.inizioSostaModel"
                              v-model="sosta.inizioSosta.orario"
                              :allowed-minutes="minutiConsentiti"
                              :min="spostamenti[0].arrivo.orario"
                              :max="spostamenti[spostamenti.length - 1].partenza.orario"
                              format="24hr"
                              full-width
                              @click:minute="$refs.inizio_sosta[index].save(sosta.inizioSosta.orario)"
                            ></v-time-picker>
                          </v-menu>
                        </div>
                        <!-- PICKER ORARIO FINE SOSTA -->
                        <div class="fine-sosta">
                          <v-menu
                            ref="fine_sosta"
                            v-model="sosta.fineSostaModel"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            :return-value.sync="sosta.fineSosta.arrivo"
                            transition="scale-transition"
                            offset-y
                            full-width
                            max-width="290px"
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                solo
                                v-model="sosta.fineSosta.arrivo"
                                label="Fine"
                                prepend-icon="access_time"
                                readonly
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-time-picker
                              v-if="sosta.fineSostaModel"
                              v-model="sosta.fineSosta.orario"
                              :allowed-minutes="minutiConsentiti"
                              :min="sosta.inizioSosta.orario"
                              :max="spostamenti[spostamenti.length - 1].partenza.orario"
                              format="24hr"
                              full-width
                              @click:minute="$refs.fine_sosta[index].save(sosta.fineSosta.orario)"
                            ></v-time-picker>
                          </v-menu>
                        </div>
                      </div>
                    </div>
                  </v-card>
                  <v-btn @click="soste.splice(index,1)" class="mx-2" fab dark small color="red">
                    <i class="fas fa-minus-circle"></i>
                  </v-btn>
                </div>
              </div>
            </div>
            <v-btn @click="commitOrario" text>AVANTI</v-btn>
          </div>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import carComponent from "./Car";

export default {
  data() {
    return {
      waiting: true,
      e1: 0,
      pickerData: new Date().toISOString().substr(0, 10),
      sedePartenza: { idSede: "", Comune: "" },
      spostamenti: [],
      soste: [],
      alert: null
    };
  },
  components: {
    carComponent
  },
  methods: {
    ...mapActions(["fetchSedi", "fetchAuto"]),
    ...mapMutations(["setSedePartenza"]),
    minutiConsentiti: m => m % 30 === 0, // Minuti che possono essere rappresentati dal v-time-picker
    calcolaTempoMinimoArrivo(index) {
      return this.spostamenti[index].partenza.orario;
    },
    // Effetua calcolo minimo orario
    calcolaTempoMinimoPartenza(index) {
      if (index == 0) {
        return "08:00";
      } else {
        return this.spostamenti[index - 1].arrivo.orario;
      }
    },
    commitOrario() {
      //Controllo orari
      for (var [index, spostamento] of this.spostamenti.entries()) {
        if (index != 0) {
          if (
            spostamento.partenza.orario <
            this.spostamenti[index - 1].arrivo.orario
          ) {
            return;
          }
        }
        if (spostamento.partenza.orario > spostamento.arrivo.orario) {
          return;
        }

        if (index != this.spostamenti.length - 1) {
          //Controllo destinazioni
          if (spostamento.arrivo.fuoriSede) {
            if (!spostamento.arrivo.indirizzo) return;
          } else {
            if (!spostamento.arrivo.sede) return;
          }
        }
      }

      //Controllo soste
      for (var sosta of this.soste) {
        if (sosta.inizioSosta.orario > sosta.fineSosta.orario) return;
        if (sosta.inizioSosta.orario < this.spostamenti[0].arrivo.orario)
          return;
        if (
          sosta.fineSosta.orario >
          this.spostamenti[this.spostamenti.length - 1].partenza.orario
        )
          return;
      }

      var dati = {
        spostamenti: this.spostamenti,
        soste: this.soste,
        data: this.pickerData,
        idSede: this.sedePartenza.idSede
      };
      this.$store.dispatch('commitOrario', dati)
      .then(() => console.log('we'));
    },
    aggiungiSpostamento() {
      this.spostamenti.splice(this.spostamenti.length - 1, 0, {
        partenza: {},
        arrivo: {}
      });
    },
    aggiungiSosta() {
      this.soste.push({
        sedeSosta: "",
        inizioSosta: {},
        fineSosta: {}
      });
    },
    moveToStep2() {
      if (this.sedePartenza.idSede != "") {
        this.alert = null;
        var dati = {
          idSede: this.sedePartenza.idSede,
          data: this.pickerData
        };
        this.waiting = true;
        this.e1 = 2;
        this.fetchAuto(dati).
        then(() => this.waiting = false);
      } else {
        this.alert = "Nessuna stazione selezionata";
      }
    },
    moveToStep3() {
      this.e1 = 3;
      this.spostamenti = [];
      this.spostamenti.push({
        partenza: {
          sede: {
            idSede: this.sedePartenza.idSede,
            Comune: this.sedePartenza.Comune
          },
          fuoriSede: false
        },
        arrivo: {}
      });
      this.spostamenti.push({
        partenza: {},
        arrivo: {}
      });
    }
  },
  computed: mapGetters(["getSedi", "getAuto", "getMacchinaSelezionata"]),
  created() {
    this.$store
      .dispatch("fetchSedi")
      .then(() => {
        this.waiting = false;
      })
      .catch(() => {
        this.waiting = false;
        this.alert = "Errore durante parsing dal server, accedere più tardi";
      });
  }
};
</script>

<style scoped>
.car-component {
  display: flex;
  justify-content: center;
}

/* SOSTE */

.sede-sosta {
  margin: 1rem;
  display: flex;
  align-items: baseline;
}

/* SELECT ORA-MINUTI INIZIO-FINE SOSTA */

.ora-inizio {
  margin-left: 1rem;
  max-width: 10rem;
}
.ora-fine {
  margin-left: 1.5rem;
  margin-right: 0.2rem;
  max-width: 10rem;
}
.minuto-inizio {
  margin-left: 0.2rem;
  max-width: 10rem;
}
.minuto-fine {
  margin-right: 1rem;
  max-width: 10rem;
}

/* SOSTA, CONTENENETE LA CARD E IL TASTO ELIMINA */
.sosta {
  display: flex;
  align-items: center;
  margin: 1rem;
}

/* CARD SOSTA CONTENTE I VARI SELECT */
.card-sosta {
  background: #e91e63;
  border-radius: 1rem;
  margin: 1rem;
  display: flex;
  align-items: center;
}

/* FLEXBOX CONTENENTI I SELECT DI INIZIO E FINE SOSTA */

.inizio-sosta,
.fine-sosta {
  display: flex;
}

/* FLEXBOX CONTENENTE LE DUE FLEXBOX INIZIO-FINE-SOSTA */

.orari-sosta {
  display: flex;
}

/* FLEXBOX CONTENENTE LE VARIE SOSTE */
.soste {
  margin: 1.5rem;
  display: flex;
  flex-direction: column;
}

/*_- SPOSTAMENTI -_ */

/* SELECT ORA-MINUTI ARRIVO-PARTENZA SOSTA */
.ora-partenza {
  margin-left: 1rem;
  max-width: 10rem;
}
.ora-arrivo {
  margin-left: 1rem;
  max-width: 10rem;
}
.minuto-partenza {
  margin-left: 0.2rem;
  max-width: 10rem;
}
.minuto-arrivo {
  margin-left: 0.2rem;
  max-width: 10rem;
}

/* DIV CONTENENET IL BOX FUORI SEDE */
.fuori-sede {
  margin: 1rem;
}

.arrivi {
  margin-left: 15px;
}

.partenze {
  margin-left: 15px;
}

/* FLEXBOX CONTENENTI LE SELECT DI PARTENZA E ARRIVO */
.partenza {
  display: flex;
  align-items: baseline;
}

.arrivo {
  display: flex;
  align-items: baseline;
}

.orario-pratenza {
  display: flex;
}

.orario-arrivo {
  display: flex;
}

/* SPOSTAMENTO, CONTENENETE LA CARD E IL TASTO ELIMINA */

.spostamento {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem;
}

/* CARD SPOSTAMENTO, CONTENENTE TUTTI I FLEX ITEMS */
.card-spostamento {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3f51b5;
  border-radius: 0.8rem;
  margin: 1rem;
  box-shadow: -1px 10px 22px 4px rgba(0, 0, 0, 0.15);
  padding: 1rem;
}

.info-spostamento {
  display: flex;
  flex-direction: column;
}

.spostamenti-stepper {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.container {
  display: flex;
  justify-content: center;
}

.spostamenti {
  margin: 1.5rem;
  display: flex;
  flex-direction: column;
}

#stepper {
  margin: 30px;
}

.btn {
  margin: 1.5rem;
}
</style>
