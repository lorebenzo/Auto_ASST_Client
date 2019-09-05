<template>
  <!-- <form @submit.prevent="onUpload" enctype="multipart/form-data"> -->
  <v-layout v-if="waiting" align-center justify-center column fill-height>
    <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
  </v-layout>
  <v-layout v-else align-center justify-center column fill-height>
    <v-text-field label="Targa" v-model="automobile.targa">Targa</v-text-field>
    <v-text-field label="Numero Aziendale" v-model="automobile.numeroAziendale">Numero Aziendale</v-text-field>
    <v-text-field label="Alimentazione" v-model="automobile.alimentazione">Alimentazione</v-text-field>
    <v-text-field label="Modello" v-model="automobile.modello">Modello</v-text-field>
    <v-text-field label="Cilindrata" v-model="automobile.cilindrata">Cilindrata</v-text-field>
    <v-text-field
      label="Anno Immatricolazione"
      v-model="automobile.annoImmatricolazione"
    >AnnoImmatricolazione</v-text-field>
    <v-text-field label="Casa Produttrice" v-model="automobile.casaAutomobilistica">Casa Produttrice</v-text-field>
    <v-select
      :items="$store.getters.getSedi.sedi"
      return-object
      label="Sede"
      solo
      item-text="Comune"
      item-value="idSede"
      v-model="automobile.sedeAppartenenza"
    ></v-select>
    <input type="file" @change="onFileChanged" />
    <button @click="onUpload">Upload!</button>
  </v-layout>
  <!-- </form> -->
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      automobile: {
        targa: "",
        numeroAziendale: "",
        alimentazione: "",
        modello: "",
        cilindrata: "",
        casaAutomobilistica: "",
        sedeAppartenenza: "",
        annoImmatricolazione: ""
      },
      waiting: true,
      selectedFile: null
    };
  },
  methods: {
    onFileChanged(event) {
      this.selectedFile = event.target.files[0];
    },
    onUpload() {
      const formData = new FormData();
      formData.append("image", this.selectedFile);
      formData.append("targa", this.automobile.targa);
      formData.append("numeroAziendale", this.automobile.numeroAziendale);
      formData.append("alimentazione", this.automobile.alimentazione);
      formData.append("modello", this.automobile.modello);
      formData.append(
        "annoImmatricolazione",
        this.automobile.annoImmatricolazione
      );
      formData.append("cilindrata", this.automobile.cilindrata);
      formData.append(
        "casaAutomobilistica",
        this.automobile.casaAutomobilistica
      );
      formData.append(
        "sedeAppartenenza",
        this.automobile.sedeAppartenenza.idSede
      );
      axios.post("http://localhost:3000/create-auto", formData);
    }
  },
  created() {
    this.$store
      .dispatch("fetchSedi")
      .then(() => {
        this.waiting = false;
      })
      .catch(() => {
        this.alert = "Errore durante parsing dal server, accedere più tardi";
      });
  }
};
</script>

