var express=require('express');
var router=express.Router();
var dbConn=require('../lib/db');

/* LISTAR */
router.get('/', function(req, res, next) {
  dbConn.query('SELECT * FROM proveedor ORDER BY id desc',function(err,rows)     {
    if(err) {
        req.flash('error', err);
        res.render('suppliers/index',{data:''});   
    } else {
        res.render('suppliers/index',{data:rows});
    }
  });
});

/* VER FORMULARIO ADD */
router.get('/add', function(req, res, next) {    
  res.render('suppliers/add', {
      nombre: ''       
  })
})

/* INSERTAR EN BASE DE DATOS */
router.post('/add', function(req, res, next) {    
  let nombre = req.body.nombre;
  let errors = false;

  if(nombre.length === 0) {
      errors = true;
      req.flash('error', "Please enter name");
      res.render('suppliers/add', {
        nombre: nombre
      })
  }

  // if no error
  if(!errors) {
      var form_data = {
        nombre: nombre
      }
      dbConn.query('INSERT INTO proveedor SET ?', form_data, function(err, result) {
          if (err) {
              req.flash('error', err)
              res.render('suppliers/add', {
                  name: form_data.nombre                   
              })
          } else {                
              req.flash('success', 'Proveedor successfully added');
              res.redirect('/suppliers');
          }
      })
  }
})

/* VER FORMULARIO EDITAR */
router.get('/edit/(:id)', function(req, res, next) {
  let id = req.params.id;
  dbConn.query('SELECT * FROM proveedor WHERE id = ' + id, function(err, rows, fields) {
      if(err) throw err
      if (rows.length <= 0) {
          req.flash('error', 'Registro not found with id = ' + id)
          res.redirect('/suppliers')
      }
      else {
          res.render('suppliers/edit', {
              id: rows[0].id,
              nombre: rows[0].nombre
          })
      }
  })
})

/* ACTUALIZAR FORMULARIO BASE DE DATOS */
router.post('/update/:id', function(req, res, next) {
  let id = req.params.id;
  let nombre = req.body.nombre;
  let errors = false;

  if(nombre.length === 0) {
      errors = true;
      req.flash('error', "Please enter name");
      res.render('suppliers/edit', {
          id: req.params.id,
          nombre: nombre
      })
  }

  if( !errors ) {   
      var form_data = {
        nombre: nombre
      }
      dbConn.query('UPDATE proveedor SET ? WHERE id = ' + id, form_data, function(err, result) {
          if (err) {
              req.flash('error', err)
              res.render('suppliers/edit', {
                  id: req.params.id,
                  nombre: form_data.nombre
              })
          } else {
              req.flash('success', 'Registro successfully updated');
              res.redirect('/supplierss');
          }
      })
  }
})

/* ELIMINAR REGISTRO BASE DE DATOS */
router.get('/delete/(:id)', function(req, res, next) {
  let id = req.params.id;
  dbConn.query('DELETE FROM proveedor WHERE id = ' + id, function(err, result) {
      if (err) {
          req.flash('error', err)
          res.redirect('/suppliers')
      } else {
          req.flash('success', 'rEGISTRO successfully deleted! ID = ' + id)
          res.redirect('/suppliers')
      }
  })
})


module.exports = router;