export default class Editor {
  constructor(data, caller) {
    this.data = data;
    this.caller = caller;

    this.fragment = this.render();

    this.toggleEditor = this.toggleEditor.bind(this);
    this.updateCard = this.updateCard.bind(this);
    this.deleteCard = this.deleteCard.bind(this);
    this.getData = this.getData.bind(this);

    this.initalize();
    this.addEventListeners();
  }

  initalize() {
    this.cardEditorDelete = ".card__editor__card__buttons__delete";
    this.cardEditorSave = ".card__editor__card__buttons__save";
  }

  addEventListeners() {
    this.caller.root.on("click", this.cardEditorCancel, this.toggleEditor);
    this.caller.root.on("click", this.cardEditorDelete, this.deleteCard);
    this.caller.root.on("click", this.cardEditorSave, this.updateCard);
  }

  updateCard(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    // let newData = e.currentTarget.form.serializeArray()[0];
    let domData = this.getData(e.currentTarget.form);

    this.caller.store.update(
      {
        listId: domData.list.id,
        cardId: domData.card.id,
        data: null,
      },
      (board) => {
        this.caller.board = board;
        this.caller.update();
      }
    );
  }

  deleteCard() {
    this.caller.store.remove(
      {
        listId: this.data.list.props.id,
        cardId: this.data.card.props.id,
      },
      (board) => {
        this.caller.board = board;
        this.caller.update();
      }
    );
  }

  getData(target) {
    let cardEditorEl = $(target).closest(".card__editor__card");

    let list = this.caller.board.lists.filter(
      (l) => l.id == cardEditorEl.data("list-id")
    )[0];
    let card = list.cards
      .filter((c) => c.id === cardEditorEl)
      .data("card-id")[0];

    return {
      list: list,
      card: card,
    };
  }

  toggleEditor(e) {
    if (
      e.target.classList.contains("card__editor__card__edit__details__textarea")
    ) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    this.caller.root.find(".card__editor").remove();
  }

  render() {
    const template = `
      <div class="card__editor">
        <form class="card__editor__card" data-list-id="${this.data.list.props.id}" data-card-id="${this.data.card.props.id}">
          <div class="card__editor__card__edit">
            <div class="card__editor__card__edit__details">
              <textarea class="card__editor__card__edit__details__textarea" name="title" dir="auto" placeholder="">${this.data.card.props.title}</textarea>
            </div>
          </div>
          <button class="card__editor__card__buttons__save" type="submit">Save</button>
          <div class="card__editor__card__buttons fade-in">
            <a class="card__editor__card__buttons__delete" href="#">
              <i class="fas fa-times"></i>
              <span class="card__editor__card__buttons__delete__text">Delete</span>
            </a>
          </div>
        </form>
        <span class="card__editor__close">
          <i class="fas fa-times"></i>
        </span>
      </div>
      `;
    return $(document.createRange().createContextualFragment(template));
  }
}
