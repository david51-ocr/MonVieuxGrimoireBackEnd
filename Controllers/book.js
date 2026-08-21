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
.catch(error => {console.log("ERREUR SAVE :", error);
      res.status(400).json({ error })});

};

exports.rateBook =(req,res) =>{
  Book.findById({_id: req.params.id})
  .then ((book) => {
    if (!book){
      return res.status (404).json({message: "Livre non trouvé"})
    } else{
     const rating = book.ratings.find((element) =>
        element.userId === req.auth.userId
      
  );
  if (rating){
    rating.grade = req.body.rating
  } else{
    book.ratings.push({
      userId: req.auth.userId,
      grade: req.body.rating
    })
  
  }
  let total = 0;
  book.ratings.forEach((element) => total = total+element.grade);

  const moyenne = total/book.ratings.length;
  book.averageRating = moyenne;
book.save()
.then(() => res.status(200).json ({message: "Note sauvegardé"}))
.catch (error => res.status(500).json ({error}))
  }
  })
  .catch (error => res.status(500).json ({error}))
  
}

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ?{
  ...JSON.parse(req.body.thing),
imageUrl :`${req.protocol}://${req.get("host")}/images/${req.filename}`
} : {...req.body};

delete bookObject._userId;
Book.findOne({_id: req.params.id})
.then ((book) => {
  if (book.userId != req.auth.userId){
    res.status (401).json ({message: 'Non autorisé'})
  } else{
    Book.updateOne ({ _id: req.params.id}, {...bookObject, _id :req.params.id})
    .then (() => res.status (200).json ({message: 'livre modifié'}))
    .catch (error => res.status (401).json ({error}));
  }
})
.catch (error => {res.status (400).json ({error})});
}

exports.getAllBook=(req, res) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
   

};

exports.getOneBook= (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};


exports.getBestRating = (req,res) =>{
  Book.find()
  .sort({averageRating: - 1})
  .limit (3)
  .then ((books) => res.status(200).json (books))
  .catch (error => res.status (500).json ({error}))
}
exports.updateBook= (req, res) => {
  Book.updateOne(
    {_id: req.params.id},
  {...req.body, _id: req.params.id })
  .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteBook =(req, res) => {
  Book.findOne({ _id: req.params.id})
       .then(book => {
          if (!book){
           return res.status(404).json({message: 'Livre inexistant'});
          }
           if (book.userId != req.auth.userId) {
               res.status(401).json({message: 'Not authorized'});
           } else {
               const filename = book.imageUrl.split('/images/')[1];
               fs.unlink(`images/${filename}`, () => {
                   Book.deleteOne({_id: req.params.id})
                       .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                       .catch(error => res.status(401).json({ error }));
               });
           }
       })
       .catch( error => {
        console.log(error);
           res.status(500).json({ error });
       });
};