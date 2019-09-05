<template>
  <div class="segnalazioni-container">
    <v-expansion-panels popout>
      <v-expansion-panel
        v-for="(segnalazione, index) of this.$store.getters.getSegnalazioni"
        :key="index"
      >
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
          <br>
          <v-icon color="grey">mdi-car</v-icon>
          <h6>{{ segnalazione.auto}}</h6>
          <br><br><br>
          <h3>{{segnalazione.segnalazione}}</h3>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
export default {
  created() {
    this.$store.dispatch("fetchSegnalazioni");
  }
};
</script>

<style scoped>
.segnalazioni-container {
  margin: 3rem;
}
h6 {
  display: inline;
}
</style>