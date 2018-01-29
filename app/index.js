import "jquery";
import dragula from "dragula";

import Store from "./store";
import List from "./components/list";
import Editor from "./components/editor";
import Composer from "./components/composer";

import "./assets/styles/scrollbars.scss";
import "./assets/styles/styles.scss";

class Trello {
  constructor(store, element) {
    this.root = element;
    this.store = store;

    this.board = this.store.getLocalStorage("trello-clone");

    this.openCardEditor = this.openCardEditor.bind(this);
    this.toggleAddCard = this.toggleAddCard.bind(this);
    this.createList = this.createList.bind(this);

    this.getData = this.getData.bind(this);
    this.getHighestIndex = this.getHighestIndex.bind(this);

    this.render();
    this.initalize();
  }

  initalize() {
    this.cardEdit = $(".list__cards__card__controls__edit");

    this.cardForm = $(".list__card__composer__btn");
    this.cardFormTextarea = $(".list__card__composer__new__textarea");
    this.cardFormCancel = $(".list__card__composer__new__btn-cancel");

    this.listForm = $(".list__add");
    this.listFormSave = $(".list__add__form__controls__btn-save");
    this.listFormCancel = $(".list__add__form__controls__btn-cancel");

    this.columns = $(".list-wrapper");
    this.cardList = $(".list__cards");

    this.columnEls = this.columns.toArray();
    this.sortables = this.columnEls.concat(this.cardList.toArray());

    this.addEventListeners();
  }

  addEventListeners() {
    this.cardEdit.on("click", this.openCardEditor);

    this.cardForm.on("click", this.toggleAddCard);
    this.cardFormCancel.on("click", this.toggleAddCard);

    this.listForm.on("click", this.toggleAddList);
    this.listFormSave.on("click", this.createList);
    this.listFormCancel.on("click", this.toggleAddList);

    dragula(this.sortables, {
      direction: 'horizontal',
      copy: false,
      ignoreInputTextSelection: true
    });
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

  toggleAddList(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    if ($(e.target).hasClass("list__add__form__name")) {
      return;
    }

    let newListComposerAddBtn = $(e.currentTarget);
    let newListComposerWrapper = $(newListComposerAddBtn).closest(
      ".list-wrapper"
    );

    newListComposerWrapper.toggleClass("is-idle");
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

    let list = $.grep(
      this.board.lists,
      l => l.id === $(listEl).data("list-id")
    )[0];

    let card = $.grep(
      list.cards,
      c => c.id === $(cardEl).data("card-id"))[0];

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

  createList(event) {
    event.preventDefault();
    event.stopPropagation();

    let listTitle = $(event.target)
      .closest("form")
      .serializeArray()[0].value;

    let newList = {
      id: this.getHighestIndex(this.board.lists),
      title: listTitle,
      cards: []
    };

    const listClass = new List(newList, this);

    this.board.lists.push(listClass.list);
    this.update();
  }

  updateList() {}
  deleteList() {}

  update() {
    this.render();
    this.initalize();
  }

  render() {
    let caller = this;

    $(this.root).empty();

    const lists = this.board.lists.map(list => {
      return new List(list, caller);
    });

    const listComposer = new Composer(this);

    lists.push(listComposer);

    const content = lists.map(list => list.fragment).join("");
    $(this.root)[0].innerHTML = content;
  }
}

$(function() {
  const store = new Store("trello-clone");

  new Trello(store, $("#board"));
});
