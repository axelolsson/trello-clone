import Card from "../card";

export default class List  {
  constructor(list, caller) {
    this.list = list;

    this.cards = this.list.cards.map(card => {
      return new Card(list.id, card, caller);
    });

    this.fragment = this.render();
  }

  render() {
     return (
      `<div class="list-wrapper">
        <div data-list-id="${this.list.id}" class="list">
          <h2 class="list__title">${this.list.title}</h2>
          <div class="list__cards">
            ${this.cards.map(card => {
              return card.fragment
            }).join("")}
          </div>
          <div class="list__card__composer">
            <form class="list__card__composer__new hide">
              <div class="list__card__composer__new__details">
                <textarea class="list__card__composer__new__textarea" name="title" dir="auto" placeholder=""></textarea>
              </div>
              <div class="list__card__composer__new__controls">
                <button class="list__card__composer__new__btn-save" type="submit">Add</button>
                <button class="list__card__composer__new__btn-cancel">X</button>
              </div>
            </form>
            <a class="list__card__composer__btn " href="# ">Add a card…</a>
          </div>
        </div>
      </div>`
    );
  }
}
