var express=require('express');
var router=express.Router();
var dbConn=require('../lib/db');

/* LISTAR */
router.get('/', function(req, res, next) {
  dbConn.query('SELECT * FROM cliente ORDER BY id desc',function(err,rows)     {
    if(err) {
        req.flash('error', err);
        res.render('clients/index',{data:''});   
    } else {
        res.render('clients/index',{data:rows});
    }
  });
});

/* LISTAR */
router.get('/', function(req, res, next) {
    let searchTerm = req.query.search || ''; // Obtén el término de búsqueda de la consulta
  
    // Utiliza la cláusula LIKE en la consulta SQL para buscar coincidencias en el nombre
    dbConn.query('SELECT * FROM cliente WHERE nombre LIKE ? ORDER BY id DESC', ['%' + searchTerm + '%'], function(err, rows) {
      if (err) {
        req.flash('error', err);
        res.render('clients/index', { data: '', searchTerm: searchTerm });
      } else {
        res.render('clients/index', { data: rows, searchTerm: searchTerm });
      }
    });
  });
  
  // Otras rutas y lógica aquí...
  
  // Ruta para renderizar la vista
  router.get('/clients/index', function(req, res, next) {
    // Otra lógica aquí...
    res.render('clients/index', { /* datos */ });
  });
  
  
/* VER FORMULARIO ADD */
router.get('/add', function(req, res, next) {    
  res.render('clients/add', {
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
      res.render('clients/add', {
        nombre: nombre
      })
  }

  // if no error
  if(!errors) {
      var form_data = {
        nombre: nombre
      }
      dbConn.query('INSERT INTO cliente SET ?', form_data, function(err, result) {
          if (err) {
              req.flash('error', err)
              res.render('clients/add', {
                  name: form_data.nombre                   
              })
          } else {                
              req.flash('success', 'Categoria successfully added');
              res.redirect('/clients');
          }
      })
  }
})

/* VER FORMULARIO EDITAR */
router.get('/edit/(:id)', function(req, res, next) {
  let id = req.params.id;
  dbConn.query('SELECT * FROM cliente WHERE id = ' + id, function(err, rows, fields) {
      if(err) throw err
      if (rows.length <= 0) {
          req.flash('error', 'Registro not found with id = ' + id)
          res.redirect('/clients')
      }
      else {
          res.render('clients/edit', {
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
      res.render('clients/edit', {
          id: req.params.id,
          nombre: nombre
      })
  }

  if( !errors ) {   
      var form_data = {
        nombre: nombre
      }
      dbConn.query('UPDATE cliente SET ? WHERE id = ' + id, form_data, function(err, result) {
          if (err) {
              req.flash('error', err)
              res.render('clients/edit', {
                  id: req.params.id,
                  nombre: form_data.nombre
              })
          } else {
              req.flash('success', 'Registro successfully updated');
              res.redirect('/clients');
          }
      })
  }
})

/* ELIMINAR REGISTRO BASE DE DATOS */
router.get('/delete/(:id)', function(req, res, next) {
  let id = req.params.id;
  dbConn.query('DELETE FROM cliente WHERE id = ' + id, function(err, result) {
      if (err) {
          req.flash('error', err)
          res.redirect('/clients')
      } else {
          req.flash('success', 'rEGISTRO successfully deleted! ID = ' + id)
          res.redirect('/clients')
      }
  })
})


module.exports = router;