import * as $ from "jquery";
import "./assets/styles/styles.scss";

class Trello {
  constructor(element) {
    this.root = element;

    this.board = {
      lists: [
        {
          id: 1,
          name: "Todo",
          cards: [
            {
              title: "Card in todo",
              description: "Some more detail goes in here"
            }
          ]
        },
        {
          id: 2,
          name: "Doing",
          cards: [
            {
              title: "Card in progress",
              description: "Some more detail goes in here"
            }
          ]
        },
        {
          id: 3,
          name: "Done",
          cards: [
            {
              title: "Card in done",
              description: "Some more detail goes in here"
            }
          ]
        }
      ]
    };
  }

  getData() {}

  createCard() {}
  updateCard() {}
  deleteCard() {}

  createList() {}
  updateList() {}
  deleteList() {}

  update() {}
  save() {}
  delete() {}

  render() {}
}

new Trello($("#app > main"));
