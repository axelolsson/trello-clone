export default class Store {
  constructor(name, callback) {
    const localStorage = window.localStorage;
    let defaultBoard = {
      lists: [
        {
          id: 0,
          title: "Todo",
          cards: [
            {
              id: 4,
              title: "Card in todo",
              description: "Some more detail goes in here"
            },
            {
              id: 5,
              title: "Card #2 in todo",
              description: "Some more detail goes in here"
            }
          ]
        },
        {
          id: 1,
          title: "Doing",
          cards: [
            {
              id: 6,
              title: "Card in progress",
              description: "Some more detail goes in here"
            }
          ]
        },
        {
          id: 2,
          title: "Done",
          cards: [
            {
              id: 7,
              title: "Card in done",
              description: "Some more detail goes in here"
            }
          ]
        }
      ]
    };

    this.getLocalStorage = () => {
      return JSON.parse(localStorage.getItem(name)) || defaultBoard;
    };

    this.setLocalStorage = board => {
      localStorage.setItem(name, JSON.stringify((board = board)));
    };

    if (callback) {
      callback();
    }
  }

  insert(board, callback) {
    this.setLocalStorage(board);

    if (callback) {
      callback();
    }
  }
}
