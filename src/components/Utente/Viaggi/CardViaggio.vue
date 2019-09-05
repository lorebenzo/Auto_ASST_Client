<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <v-row no-gutters style="width: 100%">
        <v-col cols="6">
          <v-icon>calendar_today</v-icon>
          {{viaggio.data }}
        </v-col>
        <v-col cols="6">
          <v-icon>store</v-icon>
          {{viaggio.spostamenti[0].indirizzo_partenza}}
        </v-col>
      </v-row>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-icon color="grey">mdi-crosshairs-gps</v-icon>
      <h6>{{viaggio.idviaggio}}</h6>
      <br />
      <br />
      <v-icon color="grey">mdi-car</v-icon>
      <h6>{{ viaggio.auto}}</h6>
      <div>
        <v-btn @click="openViaggioInformation" color="primary" fab small class="edit-btn">
          <v-icon>mdi-information-outline</v-icon>
        </v-btn>
      </div>

      <!-- <v-icon color="grey">mdi-calendar-text</v-icon>
      <h1>ID VIAGGIO: {{ idViaggio }}</h1>
      <h1>{{getViaggio}}</h1>
      <v-btn @click="deleteViaggio">ELIMINA</v-btn>
      <v-text-field v-model="segnalazione"></v-text-field>
      <v-btn @click="commitSegnalazione">AGGIUNGI SEGNALAZIONE</v-btn>
      <br />
      <v-icon color="grey">mdi-car</v-icon>
      <br />
      <br />
      <br />-->
    </v-expansion-panel-content>
  </v-expansion-panel>
  <!-- <v-card class="mx-auto">
    <div class="d-flex flex-row justify-space-around">
      <div class="viaggio-info d-flex flex-column justify-center">
        <div>
          <v-icon>calendar_today</v-icon>
          {{viaggio.data }}
        </div>
        <div>
          <v-icon>visibility</v-icon>
          {{viaggio.auto}}
        </div>
        <div>
          <v-icon>store</v-icon>
          {{ viaggio.spostamenti[0].indirizzo_partenza}}
        </div>
      </div>
      <div class="d-flex justify-center align-center">
        <v-avatar>
          <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
        </v-avatar>
      </div>
      <v-card-actions class="d-flex flex-row justify-end">
        <v-btn text @click="openViaggioInformation">Share</v-btn>
        <v-btn text color="purple">Explore</v-btn>
      </v-card-actions>
    </div>
  </v-card>-->
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: ["viaggio"],
  data() {
    return {
      show: false
    };
  },
  methods: {
    openViaggioInformation() {
      this.$router.push(
        `/app/viaggi/dettaglio/${this.viaggio.idviaggio}?pagina=${this.$store.getters.getPagina}`
      );
    }
  },
  computed: {
    ...mapGetters["getViaggi"]
  }
};
</script>

<style scoped>
.mx-auto {
  margin: 1rem;
  max-width: 70%;
}

.edit-btn {
  float: right
}

h6 {
  display: inline;
}
</style>