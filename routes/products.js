var express = require('express');
import { isAuth } from '../lib/middleware'

const router =  express.Router();

router.get('/view/:id', isAuth, function(req, res) {
    var id = req.params.id;
    var sqlite3 = require('sqlite3').verbose();
    let db = new sqlite3.Database('database.sqlite');

    db.get("SELECT * FROM products WHERE id = " + id, function(err, row) {
        console.log(row);
        res.render('view', {product: row});
    });

    db.close();
});

router.get('/cart/:id', isAuth, function(req, res) {
    var id = req.params.id;
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('database.sqlite');

    db.get("SELECT * FROM products WHERE id = " + id, function(err, row) {
        console.log(row);
        res.json({success:true, text: "Product " + id + " successfully bought"})
    });

    db.close();
});


export default router;