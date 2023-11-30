var express=require('express');
var router=express.Router();
var dbConn=require('../lib/db');

/* INSERTAR EN BASE DE DATOS */
router.post('/sing_up', function(req, res, next) {    
    let nombre = req.body.nombre;
    let apellido_mat = req.body.apellido_mat;
    let apellido_pat = req.body.apellido_pat;
    let dni = req.body.dni;
    let celular = req.body.celular;
    let direccion = req.body.direccion;
    let email = req.body.email;
    let errors = false;
  
    if (nombre.length === 0) {
      errors = true;
      req.flash('error', 'Please enter name');
      res.render('/sing_up', {
        nombre: nombre,
        apellido_mat: apellido_mat,
        apellido_pat: apellido_pat,
        dni: dni,
        celular: celular,
        direccion: direccion,
        email: email
      });
    }
  
    // Agrega validaciones adicionales según tus requerimientos
  
    // Si no hay errores
    if (!errors) {
      var form_data = {
        nombre: nombre,
        apellido_mat: apellido_mat,
        apellido_pat: apellido_pat,
        dni: dni,
        celular: celular,
        direccion: direccion,
        email: email
      };
  
      dbConn.query('INSERT INTO cliente SET ?', form_data, function(err, result) {
        if (err) {
          req.flash('error', err);
          res.render('/sing_up', {
            nombre: nombre,
            apellido_mat: apellido_mat,
            apellido_pat: apellido_pat,
            dni: dni,
            celular: celular,
            direccion: direccion,
            email: email
          });
        } else {                
          req.flash('success', 'Cliente successfully added');
          res.redirect('/sing_up');
        }
      });
    }
  });
  