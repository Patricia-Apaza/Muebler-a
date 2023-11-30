var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');

//Exports
module.exports = router;
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET login page. */
router.get('/login', function (req, res, next) {
  res.render('login');
});

router.get('/sing_up', function (req, res, next) {
  res.render('sing_up');
});

router.get('/list_clients', function (req, res, next) {
  res.render('list_clients');
});

router.get('/buys', function (req, res, next) {
  res.render('buys');
});

router.get('/catalogue', function (req, res, next) {
  res.render('catalogue');
});


/* POST login page. */
router.post('/dashboard', function (req, res, next) {
  email = req.body.email;
  password = req.body.password;
  dbConn.query("SELECT * FROM usuarios WHERE email='" + email + "' AND password='" + password + "' ", function (err, rows) {
    console.log(rows);
    if (err) {
      req.flash('error', err);
      console.log(err);
    } else {
      if (rows.length) {
        req.session.idu = rows[0]["id"];
        req.session.email = rows[0]["email"];
        req.session.loggedin = true;
        res.redirect('/dashboard');
      } else {
        req.flash('error', 'El usuario no existe...');
        res.redirect('/')
      }
    }
  });
});


/* GET login page. */
router.get('/dashboard', function (req, res, next) {
  if (!req.session.loggedin) {
    res.redirect('/login');
  } else {
    dbConn.query('SELECT count(id) as cantidad FROM categorias', function (err, categorias) {
      if (err) {
        req.flash('error', err);
      } else {
        dbConn.query('SELECT count(id) as cantidad FROM cliente', function (err, clientes) {
          if (err) {
            req.flash('error', err);
          } else {
            dbConn.query('SELECT count(id) as cantidad FROM proveedor', function (err, proveedores) {
              if (err) {
                req.flash('error', err);
              } else {
                dbConn.query('SELECT count(id) as cantidad FROM empleados', function (err, empleados) {
                  if (err) {
                    req.flash('error', err);
                  } else {
                    dbConn.query('SELECT nombre as cantidad FROM mueble ', function (err, mueble) {
                      if (err) {
                        req.flash('error', err);
                      } else {
                        res.render('dashboard', { datos: categorias, resultados: clientes, total: proveedores, generar: empleados, mueble: mueble });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  }
});

router.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
