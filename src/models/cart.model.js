'use strict';

import db from './index'




function getCart(req, res) {
    var id = req.params.id;

    db.get(`SELECT * FROM products WHERE id = ${id}`, (err, row) => {
        res.json({
        	success: true, 
        	text: `Product ${id} successfully bought`,
        });
      }
    );
}

////////////

export default getCart;