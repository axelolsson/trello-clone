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

    this.toggleAddCard = this.toggleAddCard.bind(this);
    this.createCard = this.createCard.bind(this);

    this.render();
    this.initalize();
  }

  initalize() {
    this.cardForm = $(".list__card__composer");
    this.save = $(".list__card__composer__new__btn-save");
    this.cancel = $(".list__card__composer__new__btn-cancel");

    this.addEventListeners();
  }

  addEventListeners() {
    this.cardForm.on("click", this.toggleAddCard);
    this.cancel.on("click", this.toggleAddCard);
    this.save.on("click", this.createCard);
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
      .offsetParent()
      .offsetParent()
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
  deleteCard() {}

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
