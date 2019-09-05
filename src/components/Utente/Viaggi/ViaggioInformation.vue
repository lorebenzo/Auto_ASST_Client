<template>
  <div class="viaggio-container">
    <div style="text-align: center">
      <v-btn @click="deleteViaggio" color="red" class="white--text edit-btn" small>
        <v-icon>mdi-delete-circle</v-icon>ELIMINA VIAGGIO
      </v-btn>
    </div>
    <h2>SPOSTAMENTI</h2>
    <v-simple-table :fixed-header="true">
      <thead>
        <tr>
          <th class="text-left">Sede Partenza</th>
          <th class="text-left">Orario Partenza</th>
          <th class="text-left">Orario Arrivo</th>
          <th class="text-left">Sede Arrivo</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(spostamento, index) of getViaggio.spostamenti" :key="index">
          <td>{{ spostamento.indirizzo_partenza }}</td>
          <td>{{ spostamento.ora_partenza }}</td>
          <td>{{ spostamento.ora_arrivo }}</td>
          <td>{{ spostamento.indirizzo_arrivo }}</td>
        </tr>
      </tbody>
    </v-simple-table>

    <h2 v-if="getViaggio.segnalazioni.length > 0">SEGNALAZIONI</h2>

    <div class="segnalazioni-container">
      <v-expansion-panels popout>
        <v-expansion-panel v-for="(segnalazione, index) of getViaggio.segnalazioni" :key="index">
          <v-expansion-panel-header>
            <v-row no-gutters style="width: 100%">
              <v-col cols="6">
                <v-icon>event</v-icon>
                {{segnalazione.data}}
              </v-col>
              <v-col v-if="segnalazione.status == 'confermato'" cols="6">
                <v-icon color="green">mdi-checkbox-marked-circle</v-icon>
              </v-col>
              <v-col v-if="segnalazione.status == 'waiting'" cols="6">
                <v-icon color="yellow">mdi-alert</v-icon>
              </v-col>
              <v-col v-if="segnalazione.status == 'respinto'" cols="6">
                <v-icon color="error">mdi-alert-circle</v-icon>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-icon color="grey">mdi-calendar-text</v-icon>
            <h6>{{ segnalazione.idViaggio}}</h6>
            <br />
            <v-icon color="grey">mdi-car</v-icon>
            <h6>{{ segnalazione.auto}}</h6>
            <br />
            <br />
            <br />
            <h3>{{segnalazione.segnalazione}}</h3>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>

    <h2>INSERISCI SEGNALAZIONE</h2>
    <v-textarea
      class="mx-2"
      label="Segnalazione"
      :rules="rules"
      counter
      rows="2"
      prepend-icon="comment"
      v-model="segnalazione"
      clearable
      clear-icon="cancel"
    ></v-textarea>
    <div style="text-align: center">
      <v-btn @click="commitSegnalazione" color="primary" small class="edit-btn">
        <v-icon>mdi-information-outline</v-icon>INVIA SEGNALAZIONE
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      idViaggio: this.$route.params.id,
      segnalazione: null,
      rules: [v => v.length <= 250 || "Massimo 250 caratteri!"]
    };
  },
  computed: {
    getViaggio() {
      return this.$store.getters.getViaggio(this.idViaggio);
    }
  },
  methods: {
    deleteViaggio() {
      this.$store
        .dispatch("deleteViaggio", { idViaggio: this.idViaggio })
        .then(() => {
          this.$router.push("/app/viaggi");
        });
    },
    commitSegnalazione() {
      this.$store
        .dispatch("commitSegnalazione", {
          idViaggio: this.idViaggio,
          segnalazione: this.segnalazione
        })
        .then(() => {});
    }
  },
  created() {}
};
</script>

<style scoped>
.viaggio-container {
  display: flex;
  flex-direction: column;
  align-content: center;
  margin: 3rem;
}
h2 {
  text-align: center;
  margin: 1rem;
}
</style>