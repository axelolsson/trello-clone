const Card = (card) => {
  return (
    `<a href="#" data-id=${card.id} class="list__cards__card">
        <div class="list__cards__card__title">
          ${card.title}
        </div>
    </a>`
  );
}

export default Card;