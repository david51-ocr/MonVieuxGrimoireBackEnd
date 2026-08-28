const Book = require ('../Models/book');
const fs = require('fs');


exports.createBook= (req, res) => {

const bookObject = JSON.parse (req.body.book);
delete bookObject._id;
delete bookObject._userId;

const book = new Book ({
  ...bookObject,
  userId: req.auth.userId,
  imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
});

book.save()
.then(() => {res.status(201).json({message : 'Livre enregistré'})})
.catch(error => 
      res.status(400).json({ error }));

};
exports.rateBook = (req, res) => {
  Book.findById({ _id: req.params.id })

    .then((book) => {
      if (!book) {
        return res.status(404).json({
          message: 'Livre non trouvé'
        });
      }

      if (req.body.rating < 0 || req.body.rating > 5) {
        return res.status(400).json({
          message: 'La note doit être comprise entre 0 et 5'
        });
      }

      const rating = book.ratings.find(
        (element) => element.userId === req.auth.userId
      );

      if (rating) {
        return res.status(400).json({
          message: 'Vous avez déjà noté ce livre'
        });
      }

      book.ratings.push({
        userId: req.auth.userId,
        grade: req.body.rating
      });

      let total = 0;

      book.ratings.forEach((element) => {
        total += element.grade;
      });

      book.averageRating = total / book.ratings.length;

      return book.save()
        .then(() => res.status(200).json(book))
        .catch((error) => res.status(500).json({ error }));
    })

    .catch((error) => res.status(500).json({ error }));
};


exports.getAllBook=(req, res) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
   

};

exports.getOneBook = (req, res) => {
  Book.findOne({ _id: req.params.id })

    .then((book) => {
      if (!book) {
        return res.status(404).json({
          message: 'Livre non trouvé'
        });
      }
      return res.status(200).json(book);
    })
    .catch((error) => res.status(500).json({ error }));
};


exports.getBestRating = (req,res) =>{
  Book.find()
  .sort({averageRating: - 1})
  .limit (3)
  .then ((books) => res.status(200).json (books))
  .catch (error => res.status (500).json ({error}))
}
exports.updateBook = (req, res) => {
  let bookObject;

  if (req.file) {
    bookObject = JSON.parse(req.body.book);

    bookObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  } else {
    bookObject = { ...req.body };
  }

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({
          message: 'Livre inexistant'
        });
      }
      if (book.userId != req.auth.userId) {
        return res.status(403).json({
          message: 'Non autorisé'
        });
      }
      return Book.updateOne(
        { _id: req.params.id },
        {
          ...bookObject,
          _id: req.params.id
        }
      )
        .then(() => {
          res.status(200).json({
            message: 'Livre modifié !'
          });
        })
        .catch((error) => {
          res.status(400).json({ error });
        });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.deleteBook =(req, res) => {
  Book.findOne({ _id: req.params.id})
       .then(book => {
          if (!book){
           return res.status(404).json({message: 'Livre inexistant'});
          }
           if (book.userId != req.auth.userId) {
               res.status(403).json({message: 'Non autorisé'});
           } else {
               const filename = book.imageUrl.split('/images/')[1];
               fs.unlink(`images/${filename}`, () => {
                   Book.deleteOne({_id: req.params.id})
                       .then(() => { res.status(200).json({message: 'Livre supprimé !'})})
                       .catch(error => res.status(401).json({ error }));
               });
           }
       })
       .catch( error => {
        console.log(error);
           res.status(500).json({ error });
       });
};