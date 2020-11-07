export default class Composer {
  constructor(caller) {
    this.caller = caller;

    this.fragment = this.render();

    this.toggleComposer = this.toggleComposer.bind(this);
    this.saveList = this.saveList.bind(this);

    this.getData = this.getData.bind(this);

    this.initalize();
    this.addEventListeners();
  }

  initalize() {
    // this.composerCancel = '.list__add__form__controls__btn-cancel';
    // this.composerSave   = '.list__add__form__controls__btn-save';
  }

  addEventListeners() {
    this.caller.root.on("click", this.composerCancel, this.toggleEditor);
    this.caller.root.on("click", this.composerSave, this.saveList);
  }

  saveList(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  }

  toggleComposer(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    if (e.target.hasClass("list__add__form__name")) {
      return;
    }
  }

  getData(target) {}

  render() {
    return `<div class='list-wrapper is-idle'>
        <div class='list__add'>
          <form class='list__add__form'>
            <span href='#' class='list__add__form__placeholder'>Add a list…</span>
            <input class='list__add__form__name' type='text' name='name' placeholder='Add a list…' autocomplete='off' dir='auto' maxlength='512'>
            <div class='list__add__form__controls'>
              <button class='list__add__form__controls__btn-save' type='submit'>Save</button>
              <button class='list__add__form__controls__btn-cancel' href='#'>X</button>
            </div>
          </form>
        </div>
      </div>
      `;
  }
}
