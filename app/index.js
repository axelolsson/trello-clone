import "jquery";

import Store from "./store";
import List from "./components/list";
import Card from "./components/card";

import "./assets/styles/styles.scss";

class Trello {
  constructor(store, element) {
    this.root = element;
    this.store = store;
    this.board = this.store.getLocalStorage("trello-clone");

    this.toggleEditCard = this.toggleEditCard.bind(this);
    this.toggleAddCard = this.toggleAddCard.bind(this);

    this.createCard = this.createCard.bind(this);
    this.deleteCard = this.deleteCard.bind(this);

    this.render();
    this.initalize();
  }

  initalize() {
    this.cardEdit = $(".list__cards__card__controls__edit");
    this.cardDelete = $(".list__cards__card__controls__delete");

    this.cardForm = $(".list__card__composer");
    this.cardFormSave = $(".list__card__composer__new__btn-save");
    this.cardFormCancel = $(".list__card__composer__new__btn-cancel");

    this.addEventListeners();
  }

  addEventListeners() {
    this.cardEdit.on("click", this.toggleEditCard);
    this.cardDelete.on("click", this.deleteCard);

    this.cardForm.on("click", this.toggleAddCard);
    this.cardFormCancel.on("click", this.toggleAddCard);
    this.cardFormSave.on("click", this.createCard);
  }

  getData(key) {
    JSON.parse(localStorage.getItem(key));
  }

  toggleAddCard(e) {
    e.preventDefault();
    e.stopPropagation();

    if ($(e.target).hasClass("list__card__composer__new__textarea")) {
      return;
    }

    let newCardComposer = $(e.currentTarget)
      .children()
      .first();
    let newCardComposerAddBtn = newCardComposer.siblings().first();

    $(".list__card__composer__new")
      .not(newCardComposer)
      .addClass("hide");
    $(".list__card__composer__btn")
      .not(newCardComposerAddBtn)
      .removeClass("hide");

    newCardComposer.toggleClass("hide");
    newCardComposerAddBtn.toggleClass("hide");
  }

  toggleEditCard(e) {
    e.preventDefault();
    e.stopPropagation();

    console.log(":: TOGGLE EDIT CARD");
  }

  createCard(e) {
    e.preventDefault();
    e.stopPropagation();

    let card = {};

    $(e.currentTarget.form)
      .serializeArray()
      .map(field => (card[field.name] = field.value));

    if (card.title === "") {
      return;
    }

    let listId = $(e.currentTarget)
      .closest(".list")
      .data("list-id");

    let list = $.grep(this.board.lists, l => l.id == listId)[0];

    card.id = this.getHighestIndex(this.board.lists) + 1;
    card.description = "";

    list.cards.push(card);

    this.store.insert(this.board, () => {
      this.update();
    });
  }

  editCard() {}
  updateCard() {}

  deleteCard(e) {
    e.preventDefault();
    e.stopPropagation();

    let listId = $(e.currentTarget)
      .closest(".list")
      .data("list-id");

    let cardId = $(e.currentTarget)
      .closest("a")
      .data("id");

    this.store.remove({ listId: listId, cardId: cardId }, board => {
      this.board = board;
      this.update();
    });
  }

  createList() {}
  updateList() {}
  deleteList() {}

  update() {
    this.render();
    this.initalize();
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
    const lists = this.board.lists.map(list => {
      return List(list);
    });

    $(this.root).html(
      `
      ${lists.join(" ")}
      <div class="list-wrapper is-idle">
        <div class="list__add">
          <form class="list__add__form">
            <span href="#" class="list__add__form__placeholder">Add a list…</span>
            <input class="list__add__form__name" type="text" name="name" placeholder="Add a list…" autocomplete="off" dir="auto" maxlength="512">
            <div class="list__add__form__controls">
              <button class="list__add__form__controls--save-btn" type="submit">Save</button>
              <a class="list__add__form__controls--cancel-btn" href="#"></a>
            </div>
          </form>
        </div>
      </div>
      `
    );
  }
}

$(document).ready(function() {
  const store = new Store("trello-clone");

  new Trello(store, $("#app > main"));
});
