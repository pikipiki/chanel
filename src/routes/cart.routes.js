'use strict';

import express     from 'express';

import { isAuth }  from '../common/middleware'
import getCart  from '../models/cart.model';

const router =  express.Router();




router.get('/:id', getCart);

////////////

export default router;