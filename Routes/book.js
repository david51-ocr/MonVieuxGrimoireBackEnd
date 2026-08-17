const express = require ('express');
const router = express.Router();

router.post('/', (req, res) => {
  delete req.body._id;

  const book = new Book({
    ...req.body
  });

  book.save()
    .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
    .catch(error => res.status(400).json({ error }));
});


router.get('/', (req, res) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
});


router.get('/bestrating', (req, res) => {
  // à faire plus tard
});


router.get('/:id', (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
});

router.put ('/:id', (req, res) => {
  Book.updateOne(
    {_id: req.params.id},
  {...req.body, _id: req.params.id })
  .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
});

router.delete ('/:id', (req, res) => {
  Book.deleteOne({_id: req.params.id})
  .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
    .catch(error => res.status(400).json({ error }));
});


module.exports=router;