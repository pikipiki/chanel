'use strict';

import db from './index'





function getProducts(req, res) {
  console.log('prod')
  db.all('SELECT * FROM products', function(err, rows) {
      return res.render('products/products', {products: rows});
  });
}

function getProduct(req, res) {
  const id = req.params.id;

  db.get("SELECT * FROM products WHERE id = " + id, function(err, row) {
      res.render('product/product', {product: row});
  });
}

function getCart(req, res) {
  const id = req.params.id;

  db.get(`SELECT * FROM products WHERE id = ${id}`, (err, row) => {
      res.json({
        success: true, 
        text: `Product ${id} successfully bought`,
      });
    }
  );
}

////////////

export {

  getProducts,
  getProduct,
  getCart

}