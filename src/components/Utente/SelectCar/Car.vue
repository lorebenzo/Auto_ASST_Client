<template>
  <div>
    <img class="stiky" src="https://picsum.photos/id/164/200/200" alt srcset />
    <h2>{{ this.targaAuto }}</h2>
    <span v-for="(liberaSiNo, orario) in getAuto.auto[targaAuto]" :key="orario">

    <v-btn
      class="btn"      
      v-if="liberaSiNo == 'LIBERA'"
      color="success"
      @click="selectCar"
    >{{ orario }}</v-btn>
    <v-btn
      class="btn"      
      v-else
      color="error"
    >{{ orario }}</v-btn>
    </span>

  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  props: ["targaAuto"],
  computed: mapGetters(["getAuto"]),
  methods: {
    ...mapMutations(["setMacchinaSelezionata"]),
    selectCar(e) {
      // Passo l'auto selezionata e anche l'orario
      var dati = {
        macchinaSelezionata: this.targaAuto,
        orarioPartenza: e.toElement.textContent
      };

      this.setMacchinaSelezionata(dati);
      this.$emit("move-step-3");
    }
  }
};
</script>

<style scoped>
div {
  margin: 30px;
  display: flex;
  flex-direction: column;
}

.btn {
  margin: 10px;
}

.stiky {
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
}
</style>


