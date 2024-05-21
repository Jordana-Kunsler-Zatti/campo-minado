<template>
  <q-page class="flex flex-center column">
    <q-btn round color="secondary" @click="handleClickHome()">
      <font-awesome-icon class="fa-solid fa-house color-gray-dark" />
    </q-btn>
    <h1>GAME</h1>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { swalConfs } from "src/utils/utils-swal";
import Swal from "sweetalert2";

const gameOverToast = () => {
  return Swal.fire(
    swalConfs({
      title: "Você estourou a bomba!",
      icon: "fa-circle-xmark",
      iconColor: "#b31b1b",
      buttonConfimLabel:
        "Tente novamente <font-awesome-icon class='fa-solid fa-arrow-rotate-right' />",
      buttonDenyLabel:
        "Página inicial <font-awesome-icon class='fa-solid fa-house' />",
    })
  ).then((result) => {
    if (result.isConfirmed) {
      console.log("Confirmando");
    } else if (result.isDenied) {
      console.log("Negado");
    }
  });
};

export default defineComponent({
  name: "GamePage",
  methods: {
    handleClickHome() {
      Swal.fire(
        swalConfs({
          title: "Você deseja pausar?",
          subtitle:
            "Se você desistir no meio da partida, ela não será salva. Mas ao pausar retomará desse ponto. Caso queira continuar basta fechar a modal no “X”",
          icon: "fa-circle-question",
          iconColor: "#ff8333",
          showCloseButton: true,
          buttonConfimLabel:
            "Pausar o jogo <font-awesome-icon class='fa-solid fa-circle-pause' />",
          buttonDenyLabel:
            "Desistir <font-awesome-icon class='fa-solid fa-times' />",
        })
      ).then((result) => {
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
