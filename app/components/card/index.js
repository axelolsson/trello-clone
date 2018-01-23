import "jquery";

export default class Card {
  constructor(listId, card, caller) {
    this.list = listId;
    this.card = card;
    this.caller = caller;

    this.fragment = this.render();

    this.createCard = this.createCard.bind(this);
    this.deleteCard = this.deleteCard.bind(this);

    this.initalize();
    this.addEventListeners();
  }

  initalize() {
    this.cardDelete = 'div[data-list-id="' + this.list + '"] .list__cards__card__controls__delete';
    this.cardFormSave = '.list__card__composer__new__btn-save';
  }

  addEventListeners() {
    this.caller.root.on("click", this.cardDelete, this.deleteCard);
    this.caller.root.on("click", this.cardFormSave, this.createCard);
  }

  createCard(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    let card = {};
    let cardForm = $(e.currentTarget.form);
    let listId = $(cardForm).closest('.list').data('list-id');

    $(cardForm)
      .serializeArray()
      .map(field => (card[field.name] = field.value));

    if (card.title === "") {
      return;
    }

    let list = $.grep(this.caller.board.lists, l => l.id == listId)[0];

    card.id = this.getHighestIndex(this.caller.board.lists) + 1;
    card.description = "";

    list.cards.push(card);

    this.caller.store.insert(this.caller.board, () => {
      this.caller.update();
    });
  }

  deleteCard(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    let listId = $(e.currentTarget).closest('.list').data('list-id');
    let cardId = $(e.currentTarget).closest('.list__cards__card').data('card-id');

    this.caller.store.remove({ listId: listId, cardId: cardId }, (board) => {
      this.caller.board = board;
      this.caller.update();
    });
  }

  getHighestIndex(lists) {
    let highestIndex = -1;

    lists.forEach(list => {
      list.cards.forEach(card => {
        if (card.id > highestIndex) {
          highestIndex = card.id;
        }
      });
    });

    return highestIndex;
  }

  render() {
    return (
      `<a href="#" data-card-id="${this.card.id}" class="list__cards__card">
        <div class="list__cards__card__details">
            <div class="list__cards__card__title">
              ${this.card.title}
            </div>
          </div>
          <div class="list__cards__card__controls">
            <span class="list__cards__card__controls__edit"><i class="fas fa-pencil-alt"></i></span>
            <span class="list__cards__card__controls__delete"><i class="fas fa-times"></i></i></span>
          </div>
      </a>`
    );
  }
}