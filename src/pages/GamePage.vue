<template>
  <q-page class="flex flex-center column">
    <q-btn round color="secondary" @click="handleClickHome()">
      <font-awesome-icon class="fa-solid fa-house color-gray-dark" />
    </q-btn>
    <h1>GAME</h1>
    <!-- <swal /> -->
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import Swal from "sweetalert2";

export default defineComponent({
  name: "GamePage",
  methods: {
    handleClickHome() {
      Swal.fire({
        title: `<label class='titleSwal'>Você deseja pausar?</label>`,
        html: `<label class='subtitleSwal'>Se você desistir no meio da partida, ela não será salva. Mas ao pausar retomará desse ponto. Caso queira continuar basta fechar a modal no “X”</label>`,
        iconHtml: `<font-awesome-icon class="fa-solid fa-circle-question iconSwal" />`,
        width: "20em",
        iconColor: "#ff8333",
        showCloseButton: true,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonColor: "#0bb3d9",
        denyButtonColor: "#dedede",
        confirmButtonText: `<label>Pausar o jogo <font-awesome-icon class="fa-solid fa-circle-pause" /></label>`,
        denyButtonText: `<label class="color-gray-dark">Desistir <font-awesome-icon class="fa-solid fa-times" /></label>`,
      }).then((result) => {
        if (result.isConfirmed) {
          console.log("Confirmando");
        } else if (result.isDenied) {
          console.log("Negado");
        }
      });
    },
  },
});
</script>
