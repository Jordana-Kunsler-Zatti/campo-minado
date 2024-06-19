<template>
  <q-page class="q-mt-none">
    <q-btn round color="secondary q-ma-md" @click="handleClickHome()">
      <font-awesome-icon class="fa-solid fa-house color-gray-dark" />
    </q-btn>

    <div class="row q-mt-md flex-center">
      <q-card class="flex-center no-box-shadow">
        <q-card-section class="column flex-center">
          <q-icon name="flag" size="40px" color="red" />
          {{ bombCount }} Bombas
        </q-card-section>
      </q-card>
      <q-card class="flex-center no-box-shadow">
        <q-card-section class="column flex-center">
          <q-icon name="timer" size="40px" color="blue" />
          {{ timer }}
        </q-card-section>
      </q-card>
      <q-card class="flex-center no-box-shadow">
        <q-card-section class="column flex-center">
          <q-icon name="fa-solid fa-trophy" size="40px" color="yellow" />
          1 Campo
        </q-card-section>
      </q-card>
    </div>

    <!-- botão para iniciar o jogo e colocar bandeiras -->
    <div class="row flex-center q-mb-md">
      <q-btn @click="init()" icon-right="send" v-bind="startButton" />

      <q-toggle
        color="red"
        v-model="isFlag"
        @click="flagButton()"
        checked-icon="flag"
        unchecked-icon="fa-solid fa-bomb"
        size="lg"
      />
    </div>

    <!-- tabuleiro -->
    <div class="col-auto flex-center">
      <div v-for="row in rowsButtons" :key="row.id" class="row flex-center">
        <div v-for="button in row.buttons" :key="button.id">
          <q-btn
            square
            unelevated
            :class="button.color"
            :id="button.id"
            :icon="button.icon"
            @click="buttonFunction(row.id, button.id)"
            v-bind="disableField"
            size="10px"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { swalConfs } from "src/utils/utils-swal";
import Swal from "sweetalert2";
import { defineComponent, ref } from "vue";

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
      window.location.reload();
      console.log("Confirmando");
    } else if (result.isDenied) {
      window.location.href = "/";
      console.log("Negado");
    }
  });
};

export default defineComponent({
  name: "GamePage",
  data() {
    return {
      isFlag: ref(false),
      game: {
        cellAroundingMine: [
          [-1, -1],
          [-1, 0],
          [-1, 1],
          [0, -1],
          [0, 1],
          [1, -1],
          [1, 0],
          [1, 1],
        ],
        boardRowsLength: 12,
        boardColumnsLength: 12,
        minesLength: 13,
        board: [],
        minesPositions: [],
        tilesRevealed: 0,
      },
      disableField: { disable: true, class: "fixed-size" },
      startButton: { disable: false, label: "Começar", color: "primary" },
      rowsButtons: [],
      flagButtonProps: { color: "grey-5", icon: "flag" },
      flagSwitch: false,
      iconNumbers: [
        "",
        "fa-solid fa-1",
        "fa-solid fa-2",
        "fa-solid fa-3",
        "fa-solid fa-4",
        "fa-solid fa-5",
      ],
      bombCount: 0,
      timer: "00:00",
    };
  },

  // o created é realizado para criar os botões ao carregar a page
  created() {
    this.createButtons();
  },

  methods: {
    // Cria os botões que compõe o campo minado
    createButtons() {
      for (let j = 0; j < this.game.boardRowsLength; j++) {
        this.rowsButtons.push({
          id: j,
          buttons: [],
        });
        for (let i = 0; i < this.game.boardColumnsLength; i++) {
          this.rowsButtons[j].buttons.push({
            id: i,
            icon: "",
            color:
              j % 2 === 0
                ? i % 2 === 0
                  ? "bg-green-medium"
                  : "bg-green-light"
                : i % 2 === 0
                ? "bg-green-light"
                : "bg-green-medium",
          });
        }
      }
    },

    // Função para colocar bandeiras onde tem bombas
    flagButton() {
      if (this.flagButtonProps.color == "grey-5") {
        this.flagButtonProps.color = "red";
        this.flagButtonProps.icon = "timer";
        this.flagSwitch = true;
      } else {
        this.flagButtonProps.color = "grey-5";
        this.flagButtonProps.icon = "flag";
        this.flagSwitch = false;
      }
    },

    // Função atribuida aos botoes do campo para realizar as ações do jogo
    buttonFunction(row, col) {
      let button = this.rowsButtons[row].buttons[col];

      if (this.flagSwitch == true && button.icon == "flag") {
        button.icon = "";
        this.bombCount--;
      } else if (this.flagSwitch == true && button.icon == "") {
        button.icon = "flag";
        this.bombCount++;
      }

      if (this.flagSwitch == false) {
        this.revealTiles(row, col);
      }
    },

    revealTiles(row, col) {
      let button = this.rowsButtons[row].buttons[col];
      let coord = this.game.board[row][col];
      if (coord == "M") {
        gameOverToast();
        return;
      }
      if (button.color == "bg-green-light") {
        button.color = "bg-beige-light";
      } else if (button.color == "bg-green-medium") {
        button.color = "bg-beige-medium";
      }
      if (button.icon == "flag") {
        button.icon = "";
        this.bombCount--;
      }
      if (coord != 0) {
        button.icon = this.iconNumbers[coord];
      }
    },

    // Função que está atribuída ao botão -começar- para inicializar um novo jogo
    init() {
      this.generateEmptyBoard();
      this.generateMinesPositions();
      this.insertMines();
      this.updateBoardNumbers();
      // this.showBoard();
      // habilita o toque nos quadrados do campo minado
      this.disableField.disable = false;
      // desabilita o botão -começar- e muda o texto e a cor
      this.startButton.disable = true;
      this.startButton.label = "Continuar";
      this.startButton.color = "secondary";

      this.timer = setInterval(() => {
        // if (this.time > 0) {
        this.time++;
        // }
      }, 1000);
    },

    // Funções relativas a lógica do campo minado
    generateEmptyBoard() {
      for (let y = 0; y < this.game.boardRowsLength; y++) {
        this.game.board.push([]);
        for (let x = 0; x < this.game.boardColumnsLength; x++) {
          this.game.board[y][x] = 0;
        }
      }
    },

    generateMinesPositions() {
      this.game.minesPositions = [];

      while (this.game.minesPositions.length < this.game.minesLength) {
        const y = this.getRandomInt(0, this.game.boardRowsLength);
        const x = this.getRandomInt(0, this.game.boardColumnsLength);

        if (!this.isAlreadyAMine([y, x])) {
          this.game.minesPositions.push([y, x]);
        }
      }
    },

    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },

    isAlreadyAMine(minePosition) {
      return this.game.minesPositions
        .join(" ")
        .includes(minePosition.toString());
    },

    insertMines() {
      for (let i = 0; i < this.game.minesPositions.length; i++) {
        const y = this.game.minesPositions[i][0];
        const x = this.game.minesPositions[i][1];
        this.game.board[y][x] = "M";
      }
    },

    updateBoardNumbers() {
      for (let i = 0; i < this.game.minesPositions.length; i++) {
        for (let j = 0; j < this.game.cellAroundingMine.length; j++) {
          const minePosition = this.game.minesPositions[i];
          const around = this.game.cellAroundingMine[j];
          const boardY = minePosition[0] + around[0];
          const boardX = minePosition[1] + around[1];

          if (
            boardY >= 0 &&
            boardY < this.game.boardRowsLength &&
            boardX >= 0 &&
            boardX < this.game.boardColumnsLength &&
            typeof this.game.board[boardY][boardX] === "number"
          ) {
            this.game.board[boardY][boardX]++;
          }
        }
      }
    },

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
          window.location.href = "/";
          console.log("Negado");
        }
      });
    },
  },
});
</script>
