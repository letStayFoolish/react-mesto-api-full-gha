const Card = require('../models/card');
const NotFoundError = require('../error_handlers/not-found-error');
const BadRequest = require('../error_handlers/bad-request-400');
const RequestForbidden = require('../error_handlers/request-forbidden-403');

// Read ALL cards
function getCards(req, res, next) {
  return Card.find({})
    .then((cards) => {
      // Status 200:
      res.send(cards);
    })
    // Status 500 - Default
    .catch(next);
}

// Create card
function createCard(req, res, next) {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      // Status 201:
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // Status 400
        return next(new BadRequest('Переданы некорректные данные при создании карточки.'));
      }
      // Status 500 - Default
      return next(err);
    });
}

// Delete card
function deleteCard(req, res, next) {
  const { cardId } = req.params;
  return Card.findById(cardId)
    .then((card) => {
      // Status 404:
      if (!card) {
        throw new NotFoundError(`Карточка с указанным _id: ${cardId} не найдена.`);
      }
      const owner = String(card.owner);
      if (owner !== req.user._id) {
        throw new RequestForbidden('Нет прав для удаления данной карточки. ');
      }

      Card.findByIdAndDelete(cardId)
        // Status 200:
        .then((result) => res.json(result))
        // Status 500 - Default
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // Status 400
        return next(new BadRequest('Переданы некорректные данные для удаления карточки.'));
      }
      // Status 500 - Default
      return next(err);
    });
}

// Put likes
function likeCard(req, res, next) {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      // Status 404:
      if (!card) {
        throw new NotFoundError(`Передан несуществующий _id: ${cardId} карточки`);
      }
      // Status 201:
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // Status 400:
        return next(new BadRequest('Переданы некорректные данные для постановки лайка.'));
      }
      // Status 500 - Default
      return next(err);
    });
}

// Delete likes
function dislikeCard(req, res, next) {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      // Status 404:
      if (!card) {
        throw new NotFoundError(`Передан несуществующий _id: ${cardId} карточки`);
      }
      // Status 200:
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // Status 400:
        return next(new BadRequest('Переданы некорректные данные для снятии лайка.'));
      }
      // Status 500 - Default
      return next(err);
    });
}
module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,

};
