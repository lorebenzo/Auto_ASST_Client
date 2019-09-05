<template>
  <!-- <div>{{$store.getters.getInformazioniUtente}}</div> -->
  <v-layout v-if="waiting" align-center justify-center column fill-height>
    <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
  </v-layout>

  <v-layout v-else align-center justify-center column class="pannello-utente-container">
    <v-alert
      type="info"
    >{{$store.getters.getInformazioniUtente.nome}} {{$store.getters.getInformazioniUtente.cognome}}</v-alert>
    <div class="email">
      <v-text-field v-model="$store.getters.getInformazioniUtente.email" label="Solo" solo disabled></v-text-field>
      <v-btn @click="changeEmail = !changeEmail" color="primary" fab small class="edit-btn">
        <v-icon color="white">mdi-pencil</v-icon>
      </v-btn>
    </div>
    <v-text-field v-if="changeEmail" v-model="nuovaEmail" label="Nuova Email" solo></v-text-field>
    <v-text-field v-if="changeEmail" v-model="password" label="Password" solo></v-text-field>
    <v-btn v-if="changeEmail" @click="cambioEmail" color="primary">V</v-btn>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      waiting: true,
      changeEmail: false,
      nuovaEmail: "",
      password: ""
    };
  },
  methods: {
    cambioEmail() {
      this.$store.dispatch("changeEmail", {
        nuovaEmail: this.nuovaEmail,
        password: this.password
      });
    }
  },
  created() {
    this.$store.dispatch("fetchInformazioniUtente").then(() => {
      this.waiting = false;
    });
  }
};
</script>

<style scoped>
.pannello-utente-container {
  margin: 3rem;
}
.edit-btn {
  display: inline;
  margin-left: 2rem;
}
.email {
  display: flex;
  justify-content: center
}
</style>