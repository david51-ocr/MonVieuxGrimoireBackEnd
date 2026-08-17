const express = require ('express');
const bookCtrl = require('../Controllers/book');
const router = express.Router();

router.post('/', bookCtrl.createBook);


router.get('/', bookCtrl.getAllBook);



router.get('/:id', bookCtrl.getOneBook);

router.put ('/:id', bookCtrl.updateBook);

router.delete ('/:id', bookCtrl.deleteBook );


module.exports=router;