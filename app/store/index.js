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

  update(query, callback) {
    let board = this.getLocalStorage();

    let lists = board.lists.reduce((state, bucket) => {
      return state.concat(
        query.listId === bucket.id
          ? Object.assign({}, bucket, {
              cards: bucket.cards.map((card) => {
                if (card.id === query.cardId) {
                  return {
                    id: card.id,
                    title: query.data.value,
                    description: card.description
                  }
                } else {
                  return card;
                }
              })
            })
          : bucket
      );
    }, []);

    board.lists = lists;
    this.setLocalStorage(board);

    if (callback) {
      callback(board);
    }
  }

  remove(query, callback) {
    let board = this.getLocalStorage();
    let lists = board.lists.reduce((state, bucket) => {
      return state.concat(
        query.listId === bucket.id
          ? Object.assign({}, bucket, {
              cards: bucket.cards.filter(card => card.id !== query.cardId)
            })
          : bucket
      );
    }, []);

    board.lists = lists;
    this.setLocalStorage(board);

    if (callback) {
      callback(board);
    }
  }
}
