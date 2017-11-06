'use strict';

import express from 'express';

import { isAuth } from '../common/middleware'
import { getProduct, getProducts, getCart } from '../models/products.model';

const router =  express.Router();




router.get('/', getProducts);
router.get('/:id', getProduct);

////////////

export default router;