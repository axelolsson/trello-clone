import "jquery";

import Store from "./store";
import List from "./components/list";
import Editor from "./components/editor";

import "./assets/styles/styles.scss";

class Trello {
  constructor(store, element) {
    this.root = element;
    this.store = store;

    this.board = this.store.getLocalStorage("trello-clone");

    this.openCardEditor = this.openCardEditor.bind(this);
    this.toggleAddCard = this.toggleAddCard.bind(this);

    this.getData = this.getData.bind(this);

    this.render();
    this.initalize();
  }

  initalize() {
    this.cardEdit = $(".list__cards__card__controls__edit");

    this.cardForm = $(".list__card__composer__btn");
    this.cardFormTextarea = $(".list__card__composer__new__textarea");
    this.cardFormCancel = $(".list__card__composer__new__btn-cancel");

    this.addEventListeners();
  }

  addEventListeners() {
    this.cardEdit.on("click", this.openCardEditor);

    this.cardForm.on("click", this.toggleAddCard);
    this.cardFormCancel.on("click", this.toggleAddCard);
  }

  toggleAddCard(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    if ($(e.target).hasClass("list__card__composer__new__textarea")) {
      return;
    }

    let newCardComposerAddBtn = $(e.currentTarget);
    let newCardComposer = $(newCardComposerAddBtn)
      .closest(".list")
      .find(".list__card__composer__new");

    $(".list__card__composer__new")
      .not(newCardComposer)
      .addClass("hide");

    $(".list__card__composer__btn")
      .not(newCardComposerAddBtn)
      .removeClass("hide");

    newCardComposer.toggleClass("hide");
    newCardComposerAddBtn.toggleClass("hide");
  }

  openCardEditor(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    let data = this.getData(e.currentTarget);

    let cardOffset = $(data.card.element).offset();
    let cardWidth = $(data.card.element).outerWidth();

    let editor = new Editor(data, this);

    this.root.append(editor.fragment);

    $(".card__editor__card").css(cardOffset);
    $(".card__editor__card").width(cardWidth);
  }

  getData(target) {
    let cardEl = $(target).closest(".list__cards__card");
    let listEl = $(target).closest(".list");

    let list = $.grep(this.board.lists, l => l.id == $(listEl).data("list-id"))[0];
    let card = $.grep(list.cards, c => c.id === $(cardEl).data("card-id"))[0];

    return {
      list: {
        props: list,
        element: listEl
      },
      card: {
        props: card,
        element: cardEl
      }
    };
  }

  createList() {}
  updateList() {}
  deleteList() {}

  update() {
    this.render();
    this.initalize();
  }

  render() {
    let caller = this;

    const lists = this.board.lists.map(list => {
      return new List(list, caller);
    });

    $(this.root).html(
      `
      <div class='list-wrapper is-idle'>
        <div class='list__add'>
          <form class='list__add__form'>
            <span href='#' class='list__add__form__placeholder'>Add a list…</span>
            <input class='list__add__form__name' type='text' name='name' placeholder='Add a list…' autocomplete='off' dir='auto' maxlength='512'>
            <div class='list__add__form__controls'>
              <button class='list__add__form__controls--save-btn' type='submit'>Save</button>
              <a class='list__add__form__controls--cancel-btn' href='#'></a>
            </div>
          </form>
        </div>
      </div>
      `
    );

    lists.map(list => $(this.root).append(list.fragment));
  }
}

$(document).ready(function() {
  const store = new Store("trello-clone");

  new Trello(store, $("#app > main"));
});
