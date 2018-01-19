const Card = (card) => {
  return (
    `<a href="#" data-id=${card.id} class="list__cards__card">
      <div class="list__cards__card__details">
          <div class="list__cards__card__title">
            ${card.title}
          </div>
        </div>
        <div class="list__cards__card__controls">
          <span class="list__cards__card__controls__edit"><i class="fas fa-pencil-alt"></i></span>
          <span class="list__cards__card__controls__delete"><i class="fas fa-times"></i></i></span>
        </div>
    </a>`
  );
}

export default Card;