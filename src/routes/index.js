'use strict';

import express       from 'express';

import cartRouter    from './cart.routes';
import productRouter from './products.routes';

const router =  express.Router();




router.use('/products', productRouter);
router.use('/cart', cartRouter);

////////////

export default router;