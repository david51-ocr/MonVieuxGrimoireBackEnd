const express = require ('express');
const bookCtrl = require('../Controllers/book');
const router = express.Router();
const auth = require ('../Middleware/auth');
const multer = require ('../Middleware/multer-config');

router.post('/', auth, multer,  bookCtrl.createBook);

router.post ('/:id/rating', auth, bookCtrl.rateBook);
router.get('/', bookCtrl.getAllBook);


router.get ('/bestrating', bookCtrl.getBestRating);


router.get('/:id', bookCtrl.getOneBook);



router.put ('/:id', auth, multer,bookCtrl.updateBook);

router.delete ('/:id', auth, bookCtrl.deleteBook );


module.exports=router;