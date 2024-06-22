<template>
  <q-page-container class="flex flex-center">
    <q-page class="q-mt-none column flex-center width-550">
      <div class="full-width">
        <q-btn round color="secondary q-ma-md" @click="handleClickHome()">
          <font-awesome-icon class="fa-solid fa-house color-gray-dark" />
        </q-btn>
      </div>

      <div class="row q-mt-md flex-center">
        <q-card class="flex-center no-box-shadow">
          <q-card-section class="column flex-center">
            <q-icon name="flag" size="40px" color="red" />
            {{ game.bombCount }} Bombas
          </q-card-section>
        </q-card>
        <q-card class="flex-center no-box-shadow">
          <q-card-section class="column flex-center">
            <q-icon name="timer" size="40px" color="blue" />
            {{ timer.minutes }}:{{ timer.seconds }}
          </q-card-section>
        </q-card>
        <q-card class="flex-center no-box-shadow">
          <q-card-section class="column flex-center">
            <q-icon name="fa-solid fa-trophy" size="40px" color="yellow" />
            {{ victories }} Vitórias
          </q-card-section>
        </q-card>
      </div>

      <div class="row no-wrap">
        <div class="col col-md-12 flex justify-center">
          <div>
            <q-btn
              @click="init()"
              icon-right="fa-solid fa-play"
              v-bind="startButton"
              class="no-wrap"
            />
          </div>
        </div>
        <div class="col-6 col-md-6">
          <q-toggle
            color="red"
            v-model="isFlag"
            checked-icon="flag"
            unchecked-icon="fa-solid fa-bomb"
            size="lg"
          />
        </div>
      </div>

      <!-- tabuleiro -->
      <div class="col-auto flex-center">
        <div
          v-for="row in rowsButtons"
          :key="row.id"
          class="no-wrap row flex-center"
        >
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
              padding="none"
            />
          </div>
        </div>
      </div>
    </q-page>
  </q-page-container>
</template>

<script>
import { LocalStorage } from "quasar";
import { swalConfs } from "src/utils/utils-swal";
import Swal from "sweetalert2";
import { ref } from "vue";

const noBombToast = () => {
  return Swal.fire({
    position: "top-end",
    width: "20em",
    html: `<label class='titleToast'> Número de bandeiras excedido! Você já sinalizou todas as bombas que esse tabuleiro possui!</label>`,
    showConfirmButton: false,
    timer: 3000,
  });
};

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
    if (result.isConfirmed) window.location.reload();
    else if (result.isDenied) window.location.href = "/";
  });
};

export default {
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
        bombCount: 13,
      },
      disableField: { disable: true, class: "fixed-size" },
      startButton: {
        disable: false,
        label: "Começar",
        color: "primary",
      },
      rowsButtons: [],
      iconNumbers: [
        "",
        "fa-solid fa-1",
        "fa-solid fa-2",
        "fa-solid fa-3",
        "fa-solid fa-4",
        "fa-solid fa-5",
      ],
      timer: {
        intervalId: 0,
        minutes: "00",
        seconds: "00",
      },
      victories: 0,
      tilesRevealed: 0,
    };
  },

  // o created é realizado para criar os botões ao carregar a page
  created() {
    this.createButtons();
  },

  beforeDestroy() {
    clearInterval(this.intervalId);
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

    // Função atribuida aos botoes do campo para realizar as ações do jogo
    buttonFunction(row, col) {
      let button = this.rowsButtons[row].buttons[col];

      if (button.color.includes("beige")) return;

      if (this.isFlag) {
        if (button.icon == "flag") {
          button.icon = "";
          this.game.bombCount++;
        } else if (button.icon == "") {
          if (this.game.bombCount > 0) {
            button.icon = "flag";
            this.game.bombCount--;
          } else noBombToast();
        }
      } else {
        if (button.icon == "flag") return;
        this.revealTiles(row, col);
      }
    },

    revealTiles(row, col) {
      let button = this.rowsButtons[row].buttons[col];
      let coord = this.game.board[row][col];

      if (coord == "M") {
        LocalStorage.clear();
        gameOverToast();
        return;
      }

      button.color = button.color.replace("green", "beige");

      if (button.icon == "flag") {
        button.icon = "";
        this.game.bombCount--;
      }

      if (coord != 0) button.icon = this.iconNumbers[coord];

      this.tilesRevealed++;
    },

    handleVictory() {
      Swal.fire(
        swalConfs({
          title: "Você venceu!",
          icon: "fa-circle-check",
          iconColor: "#31c43b",
          showCloseButton: true,
          buttonConfimLabel: "Jogar novamente",
          buttonDenyLabel: "Desistir",
        })
      ).then((result) => {
        if (result.isConfirmed) {
          // LocalStorage.clear();
          LocalStorage.set("victories", ++this.victories);
          window.location.reload();
        } else if (result.isDenied) {
          LocalStorage.clear();
          window.location.href = "/";
        }
      });
    },

    handlePause() {},

    // Função que está atribuída ao botão -começar- para inicializar um novo jogo
    init() {
      this.generateEmptyBoard();
      this.generateMinesPositions();
      this.insertMines();
      this.updateBoardNumbers();

      // habilita o toque nos quadrados do campo minado
      this.disableField.disable = false;

      // desabilita o botão -começar- e muda o texto e a cor
      this.startButton.disable = true;
      this.startButton.label = "Continuar";
      this.startButton.color = "secondary";
      this.startTimer(0);
    },

    startTimer(duration) {
      var timer = duration;

      this.timer.intervalId = setInterval(() => {
        this.timer.minutes = parseInt(timer / 60, 10);
        this.timer.seconds = parseInt(timer % 60, 10);

        if (this.timer.minutes < 10)
          this.timer.minutes = `0${this.timer.minutes}`;

        if (this.timer.seconds < 10)
          this.timer.seconds = `0${this.timer.seconds}`;

        ++timer;
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
          console.log("entrei na confirmação, dessa caralha");
          const dataaaa = this;
          console.log({ dataaaa });
          console.log({ dataaaaTeste: dataaaa.map((a) => a) });
          console.log(JSON.stringify(dataaaa));
          const newData = JSON.stringify(dataaaa);
          LocalStorage.set("data", newData);
          // window.location.href = "/";
        } else if (result.isDenied) {
          // LocalStorage.clear();
          window.location.href = "/";
        }
      });
    },
  },

  watch: {
    tilesRevealed: {
      handler(tilesRevealed) {
        if (tilesRevealed === 131) {
          this.handleVictory();
        }
      },
    },
  },

  mounted() {
    let allData = LocalStorage.getAll().data;

    if (allData) {
      allData = JSON.parse(allData);

      if (Object.keys(allData).length) {
        for (const key of Object.keys(allData)) {
          this[key] = allData[key];
        }

        this.startTimer(this.timer.seconds + this.timer.minutes * 60);
        LocalStorage.clear();
      }
    }
  },
};
</script>
