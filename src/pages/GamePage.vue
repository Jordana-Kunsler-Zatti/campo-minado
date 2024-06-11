<template>
  <q-page class="q-mt-none">
    <q-btn
      round
      color="grey-4"
      icon="home"
      size="10px"
      class="absolute-top-left q-mt-none q-ml-md"
    />
    
    <div class="row q-mt-xl flex-center">
      <q-card class="flex-center no-box-shadow">
        <q-card-section class="column flex-center">
          <q-icon name="flag" size="40px" color="red"/>
          {{ game.minesLength }} Bombas
        </q-card-section>
      </q-card>
      <q-card class="flex-center no-box-shadow">
        <q-card-section class="column flex-center">
          <q-icon name="timer" size="40px" color="blue"/>
          00:00
        </q-card-section>
      </q-card>
      <q-card class="flex-center no-box-shadow">
        <q-card-section class="column flex-center">
          <q-icon name="flag" size="40px" color="yellow"/>
          1 Campo
        </q-card-section>
      </q-card>
    </div>

    <!-- botão para iniciar o jogo -->
    <div class="row flex-center">
      <q-btn id="a1"
        @click="init()"
        icon-right="send"
        v-bind="startButton"
        class="q-mb-md"
      />
  
      <q-btn
        round
        size="10px"
        @click="flagButton()"
        v-bind="flagButtonProps"
      />
    </div>

    <!-- tabuleiro -->
    <div class="col-auto flex-center">
      <div v-for="row in rows" :key="row.id" class="row flex-center">
        <div v-for="button in row.buttons" :key="button.id">
          <!-- :label="button.label" -->
          <q-btn
            square
            :color="button.color"
            :id="button.id"
            :icon="button.icon"
            @click="buttonFunction(row.id, button.id)"
            v-bind="disableField"
            size="10px"
            class="fixed-size"
          />
        </div>
      </div>
    </div>

    <!-- imprime os numeros lógicos do tabuleiro na fase de teste, excluir posteriormente  -->
    <div id="board" class="flex flex-center"></div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "GamePage",
  data() {
    return {
      game: {
        cellAroundingMine: [
          [-1, -1],[-1, 0],[-1, 1],
          [ 0, -1]        ,[ 0, 1],
          [ 1, -1],[ 1, 0],[ 1, 1],
        ],
        boardRowsLength: 12,
        boardColumnsLength: 12,
        minesLength: 13,
        board: [],
        minesPositions: [],
      },
      disableField:{disable:true},
      startButton:{disable:false, label:"Começar", color:"primary"},
      rows:[],
      flagButtonProps:{color:"grey-5", icon: 'flag'},
      flagSwitch: false,
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
        this.rows.push({id:j, buttons:[]})
        for (let i = 0; i < this.game.boardColumnsLength; i++) {
          this.rows[j].buttons.push({
            id: i,
            icon:'none',
            // label: i,
            color: j % 2 === 0 ? i % 2 === 0 ? 'primary' : 'secondary' : i % 2 === 0 ? 'secondary' : 'primary'
          });
        }
      }
    },

    // Função para colocar bandeiras onde tem bombas
    flagButton() {
      if (this.flagButtonProps.color == 'grey-5') {
        this.flagButtonProps.color = 'red'
        this.flagButtonProps.icon = 'timer'
        this.flagSwitch = true
      } else {
        this.flagButtonProps.color = 'grey-5'
        this.flagButtonProps.icon = 'flag'
        this.flagSwitch = false
      }
    },

    // Função atribuida aos botoes do campo para realizar as ações do jogo
    buttonFunction(row, col) {
      let button = this.rows[row].buttons[col]
      let coord = this.game.board[row][col]

      if (this.flagSwitch == true && button.icon == 'flag') {
        button.icon = 'none'
      } else if (this.flagSwitch == true && button.icon == 'none') {
        button.icon = 'flag'
      }

      if (this.flagSwitch == false) {
        // if (coord == 0) { this.searchForEmptyTiles(row, col) }
        this.revealTiles(button, coord)
      }

    },

    // searchForEmptyTiles(row, col){
    //   if (this.game.board[row][col] === 0) {
    //     this.revealTiles(event,row,col)
    //   }
    // },

    revealTiles(button, coord) {
      if (coord == 'M') {
        // Lógica de fim de jogo
      } else{
        if (button.color != 'primary')  {
          button.color = 'black'
        } else {
          button.color = 'grey-5'
        }
      }
    },

    // Função que está atribuída ao botão -começar- para inicializar um novo jogo
    init() {
      this.generateEmptyBoard();
      this.generateMinesPositions();
      this.insertMines();
      this.updateBoardNumbers();
      this.showBoard();
      // habilita o toque nos quadrados do campo minado
      this.disableField.disable = false;
      // desabilita o botão -começar- e muda o texto e a cor
      this.startButton.disable = true;
      this.startButton.label = "Continuar";
      this.startButton.color = "secondary";
    },

    // Função que printa o array da lógica do jogo na tela apagar ou comentar posteriormente
    showBoard() {
      let $board = document.getElementById('board')
      for (let y = 0; y < this.game.board.length; y++) {
        let $row = document.createElement('DIV');
        for (let x = 0; x < this.game.board[y].length; x++) {
            let $cell = document.createElement('BUTTON');
            $cell.innerHTML = this.game.board[y][x];
            $row.appendChild($cell);
        }
        $board.appendChild($row);
      }
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
  },
});
</script>
<style scoped>
.fixed-size {
  width: 10px;
  height: 10px;  
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}
</style>