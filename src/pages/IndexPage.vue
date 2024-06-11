<template>
  <q-page class="flex flex-center chess-background">
    <div class="flex flex-center opacity no-wrap column">
      <p class="text-h3 h3 text-center">Bem vindo ao <b>Campo Minado</b></p>
      <q-btn
        class="q-mt-md"
        color="primary"
        icon-right="arrow_forward"
        label="Ir para o campo"
        to="/game"
      />
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "IndexPage",
});
</script>
