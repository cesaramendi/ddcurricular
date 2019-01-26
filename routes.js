const express = require('express');
const multer = require('multer');
const pool = require('./bd.js');
const app = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Elije la carpeta donde guardar segun el tipo de proyecto
    let tipo = req.body.tipo == 1 ? 'ServicioComunitario/' : 'Extension/';
    cb(null, 'proyectos/' + tipo);
  },
  filename: function (req, file, cb) {
    //console.log(file);
    // Extraemos la extension del archivo
    let ext = file.originalname.split('.');
    ext = ext[ext.length - 1];
    // En dado que el nombre del archivo tenga un timestamp como el usado aqui, se le quita el viejo stamp
    let nombre = req.body.nombreSolicitud.replace(/-[0-9]{13}/,'');
    // En el nombre del archivo se sustituyen los espacios por _
    cb(null,`${ nombre.replace(/ /g, '_') }-${ Date.now() }.${ext}`);
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // aka 1MB * 5
  }
  /*fileFilter: function(req, file, cb) {
    if(req.session.rol == 2 || req.session.rol == 3) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }*/
});


const options = {
  root: __dirname + '/dist/pages/',
}

const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

//rol:
//// 1: Admin
//// 2: Desco
//// 3: Facultad

//GET Requests ------------------------------------

app.get('/dashboard', (req, res) => {
  if(req.session.rol == 1) {
    send(res, 'admin/dashboard.html');
  } else if(req.session.rol == 2) {
    send(res, 'desco/dashboard.html');
  } else if(req.session.rol == 3) {
    send(res, 'facultad/dashboard.html');
  } else {
    forbid(res);
  }
})
app.get('/enviarSolicitudA', asyncMiddleware( async(req, res) => {
   send(res, 'facultad/enviarSolicitudA.html');
}))

app.get('/Reporte', asyncMiddleware( async(req, res) => {
  if(req.session.rol == 1) {
    send(res, 'admin/Reporte.html');
  } else if(req.session.rol == 2) {
    send(res, 'desco/Reporte.html');
  } else if(req.session.rol == 3) {
    send(res, 'facultad/Reporte.html');
  } else {
    forbid(res);
  }

   send(res, 'facultad/Reporte.html');
}))
app.get('/enviarProyecto', asyncMiddleware( async (req, res) => {
  if(true) {
    send(res, 'facultad/enviarProyecto.html');
  } else {
    forbid(res);
  }
}) );

app.post('/enviarSolicicitudA', asyncMiddleware(async (req, res) =>{
  console.log('req.bodya');
  console.log(req.body);
   let data = [
      "req.body.Identificacion",
      "req.body.nombreS",
      "req.body.Solicitante",
      "req.body.lugar",
      "req.body.Cantidad",
      "req.body.FechaP",
      "req.body.Tipo",
      "req.body.Introducion",
    ]
 // await pool.query('INSERT INTO SolicitudDeA VALUES(0,?,?,?,?,?,?,?,?)', data);
   console.log(data);

    res.redirect('/success');


}))
app.get('/enviarProyecto', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 3)) {
    send(res, 'facultad/enviarProyecto.html');
  } else {
    forbid(res);
  }
}) );

app.get('/getAvancesFromProject', asyncMiddleware( async (req, res) => {
  if(Number.isSafeInteger(Number(req.query.id)) && await isValidSessionAndRol(req, 2, 3)) {
    let data = await pool.query('SELECT * FROM avances WHERE refProyecto=?',[req.query.id]);
    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/getDocsFromProject', asyncMiddleware( async (req, res) => {
  if(Number.isSafeInteger(Number(req.query.id)) && await isValidSessionAndRol(req, 2, 3)) {
    let data = await pool.query('SELECT ruta,tipo,numero,refAvance FROM documentos WHERE refProyecto=?',[req.query.id]);
    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/getParticipantesFromProject', asyncMiddleware( async (req, res) => {
  if(Number.isSafeInteger(Number(req.query.id)) && await isValidSessionAndRol(req, 2, 3)) {
    let data = await pool.query('SELECT * FROM participantes WHERE refProyecto=?',[req.query.id]);
    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/getUsers', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 1)) {
    let data = await pool.query('SELECT * FROM usuarios');
    res.json({ data });
  } else {
    forbid(res);
  }
}) );
/*
app.get('/getProyectos', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 2, 3)) {
    let data;
    if(req.session.rol == 3) {
      data = await pool.query('SELECT * FROM proyectos WHERE email=?',[req.session.user]);
    } else {
      data = await pool.query('SELECT * FROM proyectos');
    }
    res.json({ data });
  } else {
    forbid(res);
  }
}) );
*/
////////////////////////Reportes//////////////////////////////////////////////

app.get('/getCarrerasCantTipos', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 2, 3)) {
    let data;
    if(req.session.rol == 3) {
      data = await pool.query('SELECT tipo, COUNT(tipo) AS cant FROM carreras WHERE email=? GROUP BY tipo',[req.session.user]);
      //data = await pool.query('SELECT * FROM carreras WHERE email=?',[req.session.user]);
    } else {
      data = await pool.query('SELECT tipo, COUNT(tipo) AS cant FROM carreras GROUP BY tipo');
    }
    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/getCarrerasCantStatus', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 2, 3)) {
    let data;
    if(req.session.rol == 3) {
      data = await pool.query('SELECT status, COUNT(status) AS cant FROM carreras WHERE email=? GROUP BY status',[req.session.user]);
      //data = await pool.query('SELECT * FROM carreras WHERE email=?',[req.session.user]);
    } else {
      data = await pool.query('SELECT status, COUNT(status) AS cant FROM carreras GROUP BY status');
    }
    res.json({ data });
  } else {
    forbid(res);
  }
}) );
///////////////////////////////////////////////////////////////////////////////

app.get('/getProyectosDDC', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 2, 3)) {
    let data;
    if(req.session.rol == 3) {
      data = await pool.query('SELECT * FROM carreras WHERE email=?',[req.session.user]);
    } else {
      data = await pool.query('SELECT * FROM carreras');
    }
    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/getAsesorias', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 2, 3)) {
    let data;
    if(req.session.rol == 3) {
      data = await pool.query('SELECT * FROM asesorias WHERE email=?',[req.session.user]);
    } else {
      data = await pool.query('SELECT * FROM asesorias');
    }
    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/login', (req, res) => {
  if(req.session.isPopulated) {
    res.redirect('/dashboard');
  } else {
    send(res, 'login.html');
  }
});

app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
})

app.get('/proyectos/:tipo/:nombre', (req, res) => {
  console.log(req.params);
  res.sendFile(`${req.params.tipo}/${req.params.nombre}`, {root: __dirname + '/proyectos/'});
})

app.get('/register', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 1)) {
    send(res, 'admin/register.html');
  } else {
    forbid(res);
  }
}) );

app.get('/success', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 3, 2)) {
    if(req.session.rol == 3){
      send(res, 'facultad/success.html');
    } else {
      send(res, 'desco/success.html');
    }
  } else {
    forbid(res);
  }
}) );

// POST Requests ---------------------------------

app.post('/actualizarDocs', asyncMiddleware(async (req, res) => {
  if(await isValidSessionAndRol(req, 3)) { // Si es valida la sesion
    if (!(await verificarAutoridad(req, req.body.refProyecto))) {
      res.send(`${new Date().toLocaleString()} -> ${req.path}: Fallo en la autorización por ${req.session.user}`);
      throw new Error(`${new Date().toLocaleString()} -> ${req.path}: Fallo en la autorización por ${req.session.user}`);
    }
    await upload.any()(req, res, async function(err) { // Sube los archivos
      if(err) {
        return res.end('Error al subir archivos. Esto puede ocurrir si algun archivo es mayor a 5MB.');
      } else {
        console.log(req.files);
        console.log(req.files[0].fieldname[9]);
        for(let i = 0; i < req.files.length; i++) {
          //obtiene el numero de archivo
          let nArchivo = req.files[i].fieldname[9];
          let ruta = req.files[i].path;
          let data = [
            ruta,
            req.body.refProyecto,
            nArchivo,
          ]
          await pool.query('UPDATE documentos SET ruta=?, fechaSubida=NOW() WHERE refProyecto=? && tipo=2 && numero=?', data);
          await pool.query('UPDATE proyectos SET status=1 WHERE id=?',[req.body.refProyecto]);
          console.log(req.body.refProyecto);
        }
        res.redirect('/success');

      }
    });


  } else {
    forbid(res);
  }
}))

app.post('/agregarParticipantes', asyncMiddleware( async (req, res) => {
  if (await isValidSessionAndRol(req, 3)) {
    if (!(await verificarAutoridad(req, req.body.refProyecto))) {
      res.send(`${new Date().toLocaleString()} -> ${req.path}: Fallo en la autorización por ${req.session.user}`);
      throw new Error(`${new Date().toLocaleString()} -> ${req.path}: Fallo en la autorización por ${req.session.user}`);
    }
    let fechaNac = req.body.fechaNac.split('/');
    let data = [
      //id -> 0
      req.body.nombre,
      req.body.apellido,
      req.body.cedula,
      req.body.lugar,
      req.body.genero,
      `${fechaNac[2]}-${fechaNac[1]}-${fechaNac[0]}`,
      req.body.tipoParticipante,
      req.body.refProyecto,
    ]
    await pool.query('INSERT INTO participantes VALUES(0,?,?,?,?,?,?,?,?)', data);
    res.redirect('/success');
  } else {
    forbid(res);
  }
}) );

app.post('/descoUpdate', asyncMiddleware( async (req, res) => {
  console.log(req.body);
  if (await isValidSessionAndRol(req, 2)) {
    let nota = req.body.nota == ''? null : req.body.nota;
    await pool.query('UPDATE proyectos SET nota=?, status=? WHERE id=?', [nota, req.body.status, req.body.id]);
    res.redirect('/dashboard');
  } else {
    forbid(res);
  }
}) );

app.post('/carreraUpdate', asyncMiddleware( async (req, res) => {
  console.log(req.body);
  if (await isValidSessionAndRol(req, 2)) {
    let nota = req.body.nota == ''? null : req.body.nota;
    await pool.query('UPDATE carreras SET nota=?, status=? WHERE id=?', [nota, req.body.status, req.body.id]);
    res.redirect('/dashboard');
  } else {
    forbid(res);
  }
}) );

app.post('/editUser', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 1)) {
    if(req.body.pass == undefined) {
      await pool.query('UPDATE usuarios SET email=?, rol=?, facultad=?  WHERE email = ?',
      [req.body.email, req.body.rol, req.body.facultad, req.body.email]);
    } else {
      await pool.query('UPDATE usuarios SET email=?, pass=SHA(?), rol=?, facultad=?  WHERE email = ?',
      [req.body.email, req.body.pass, req.body.rol, req.body.facultad, req.body.email]);
    }
    res.json({data: 'ok'});
  } else {
    forbid(res);
  }
}) );

app.post('/finalizarProyecto', asyncMiddleware(async (req, res) => {
  if (await isValidSessionAndRol(req, 3)) {
    if (!(await verificarAutoridad(req, req.body.refProyecto))) {
      res.send(`${new Date().toLocaleString()} -> ${req.path}: Fallo en la autorización por ${req.session.user}`);
      throw new Error(`${new Date().toLocaleString()} -> ${req.path}: Fallo en la autorización por ${req.session.user}`);
    }
    await pool.query('UPDATE proyectos SET status=7 WHERE id=?', [req.body.fP]);
    res.redirect('/success');
  } else {
    forbid(res);
  }
}) );

app.post('/login', asyncMiddleware( async(req, res) => {
  let user = await verificarUser(req);
  if(user) { //valid user
    req.session.user = user.email;
    req.session.rol = user.rol;
    if(user.rol == 3) req.session.facultad = user.facultad;
    res.redirect('/dashboard');
  } else {
    forbid(res);
  }
}) );

app.post('/register', asyncMiddleware( async (req, res) => {
  let user = req.body;
  if (await isValidSessionAndRol(req, 1)) {
    await pool.query('INSERT INTO usuarios VALUES (?,SHA(?),?,?)', [user.email, user.pass, user.rol, user.facultad]);
    res.redirect('/dashboard');
  } else {
    forbid(res);
  }
}) );

app.post('/enviarSolicitudA', asyncMiddleware( async(req, res) => {
   send(res, 'facultad/enviarSolicitudA.html');
}))

app.get('/enviarActualizacion', asyncMiddleware( async(req, res) => {
   send(res, 'facultad/enviarActualizacion.html');
}))

app.post('/subirAval', asyncMiddleware(async (req, res) =>{
  if (await isValidSessionAndRol(req, 2)) {

    await upload.any()(req, res, async function(err) { // Sube los archivos
      if(err) {
        return res.end('Error al subir archivos. Esto puede ocurrir si el archivo es mayor a 5MB.');
      } else {
        console.log(req.body);
        console.log(req.files);
        let dataDoc = [
          //id
          req.body.refProyecto,
          //refAvance
          req.files[0].path,
          req.files[0].filename,
          //fechaSubida
          //tipo -> Aval -> 3
          //numero -> 1
        ];
        await pool.query('INSERT INTO documentos VALUES(0,?,NULL,?,?,NOW(),3,1)', dataDoc);
        res.redirect('/success');
      }
    });

  } else {
    forbid(res);
  }
}) );

app.post('/subirAvance', asyncMiddleware(async (req, res) => {
  if(await isValidSessionAndRol(req, 3)) { // Si es valida la sesion
    if (!(await verificarAutoridad(req, req.body.refProyecto))) {
      res.send(`${new Date().toLocaleString()} -> ${req.path}: Fallo en la autorización por ${req.session.user}`);
      throw new Error(`${new Date().toLocaleString()} -> ${req.path}: Fallo en la autorización por ${req.session.user}`);
    }
    await upload.array('inputFile',10)(req, res, async function(err) { // Sube los archivos
      if(err) {
        return res.end('Error al subir archivos. Esto puede ocurrir si algun archivo es mayor a 5MB.');
      } else {
        console.log(req.files);
        console.log(req.body);
        let numerosAvance = await pool.query('SELECT numero FROM avances WHERE refProyecto=?', [req.body.refProyecto]);
        let lastAvance = Math.max.apply(Math, numerosAvance.map(x => x.numero));
        lastAvance < 0 ? lastAvance = 0 : '';
        let avanceData = [
          // id
          req.body.refProyecto,
          lastAvance + 1,
          `${req.body.anoInicio}-${req.body.mesInicio}-${req.body.diaInicio}`,
          req.body.notaAvance,
        ]
        let qryRes = await pool.query('INSERT INTO avances VALUES(0,?,?,?,?)', avanceData);
        await pool.query('UPDATE proyectos SET avances=avances+1 WHERE id=?', [req.body.refProyecto]);

        for(let i = 0; i < req.files.length; i++) {
          let docData = [
            // id
            req.body.refProyecto,
            qryRes.insertId,
            req.files[i].path,
            req.files[i].filename,
            // Fecha subida
            // tipo -> 4: avances
            i+1 // numero
          ]
          await pool.query('INSERT INTO documentos VALUES(0,?,?,?,?,NOW(),4,?)', docData);
        }
        res.redirect('/success');
      }
    });


  } else {
    forbid(res);
  }
}))

app.post('/uploadProject', upload.array('inputFile', 10),asyncMiddleware(async (req, res) => {
  console.log(req.body);
  console.log(req.files);
  if (await isValidSessionAndRol(req,3)) {
    let proyData = [
      req.session.user, // email
      req.body.nombreS,
      "",
      req.session.user,
      "",
      req.body.Carrera,
      req.body.Decripcion,
      req.body.tipo,
      "",
      "",
      `${req.body.anoInicio}-${req.body.mesInicio}-${req.body.diaInicio}`,//fecha inicio
      `${req.body.anoFin}-${req.body.mesFin}-${req.body.diaFin}`,//fechafin
      req.body.objGeneral,
      req.body.objsEspecificos,
      req.body.tipo,
      /* ^ tipo-------------------------
      /* 1: Servicio Comunitario
      /* 2: Extension
      /* ------------------------------*/
      1,
      /* ^ status-----------------------
      /* 0: esperando correccion
      /* 1: recibido
      /* 2: para revisar
      /* 3: rechazado por desco
      /* 4: validado
      /* 5: rechazado por consejo
      /* 6: aprobado
      /* 7: finalizado
      /* ------------------------- */
      //nota
      //avances -> 0
    ]
    let qryRes = await pool.query('INSERT INTO proyectos VALUES(0,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NULL,0)', proyData);
    for(let i = 0; i < req.files.length; i++) {
      let docData = [
        //id: 0: auto
        qryRes.insertId,
        //refAvance: NULL
        req.files[i].path,
        req.files[i].filename,
        (new Date()).toISOString().split('T')[0], // Obtiene solo la fecha en formato yyyy-mm-dd
        //tipo: inicio, actualizado, etc.
        i+1,
      ];
      console.log(docData);
      await pool.query('INSERT INTO documentos VALUES(0,?,NULL,?,?,?,1,?)', docData);
      await pool.query('INSERT INTO documentos VALUES(0,?,NULL,?,?,?,2,?)', docData);
    }
    res.redirect('/success');
  } else {
    forbid(res);
  }


}) );


app.post('/uploadProjectDDC', upload.array('inputFile', 10),asyncMiddleware(async (req, res) => {
  console.log(req.body);
  console.log(req.files);
  if (await isValidSessionAndRol(req,3)) {
    let proyData = [
      req.session.user, // email
      req.body.nombreSolicitud,
      req.body.tipo,
      /* ^ tipo-------------------------
      /* 1: Pregrado
      /* 2: Postgrado
      /* 3: Diplomado
      /* ------------------------------*/
      req.body.apellidoSolicitante,
      req.body.nombreSolicitante,
      req.body.disenno,
      req.body.coordinador,
      req.body.introduccion,
      req.body.participantes,
      req.body.descripcion,
      1,
      /* ^ status-----------------------
      /* 0: esperando correccion
      /* 1: recibido
      /* 2: para revisar
      /* 3: rechazado por desco
      /* 4: validado
      /* 5: rechazado por consejo
      /* 6: aprobado
      /* 7: finalizado
      /* ------------------------- */
    ]
    let qryRes = await pool.query('INSERT INTO carreras VALUES(0,?,CURDATE(),?,?,?,?,?,?,?,?,?,?,NULL)', proyData);
    for(let i = 0; i < req.files.length; i++) {
      let docData = [
        //id: 0: auto
        qryRes.insertId,
        //refAvance: NULL
        req.files[i].path,
        req.files[i].filename,
        (new Date()).toISOString().split('T')[0], // Obtiene solo la fecha en formato yyyy-mm-dd
        //tipo: inicio, actualizado, etc.
        i+1,
      ];
      console.log(docData);
      await pool.query('INSERT INTO documentos VALUES(0,?,NULL,?,?,?,1,?)', docData);
      await pool.query('INSERT INTO documentos VALUES(0,?,NULL,?,?,?,2,?)', docData);
    }
    res.redirect('/success');
  } else {
    forbid(res);
  }


}) );

app.post('/uploadSolicicitudAsesoria', upload.array('inputFile', 10),asyncMiddleware(async (req, res) => {
  console.log(req.body);
  console.log(req.files);
  if (await isValidSessionAndRol(req,3)) {
    let asesoData = [
      req.session.user, // email
      req.body.titulo,
      req.body.apellidoSolicitanteA,
      req.body.nombreSolicitanteA,
      req.body.lugar,
      req.body.cantidadParticipantes,
      req.body.fecha,
      req.body.tipo,
      /* ^ tipo-------------------------
      /* 1: Curso
      /* 2: Taller
      /* 3: Formacion
      /* ------------------------------*/
      req.body.introduccion,
      1,
      /* ^ status-----------------------
      /* 0: esperando correccion
      /* 1: recibido
      /* 2: para revisar
      /* 3: rechazado por desco
      /* 4: validado
      /* 5: rechazado por consejo
      /* 6: aprobado
      /* 7: finalizado
      /* ------------------------- */
    ]
    let qryRes = await pool.query('INSERT INTO asesorias VALUES(0,?,?,?,?,?,?,?,?,?,?)', asesoData);

    res.redirect('/success');
  } else {
    forbid(res);
  }


}) );

// Else

app.get('*', function(req, res) {
  forbid(res);
})

function forbid(res) {
  res.status(403).sendFile('Forbid.html', options);
}

function send(res, file) {
  res.sendFile(file, options);
}

// Verifica que el usuario y la clave coincidan
async function verificarUser(req) {
  console.log(req.body);
  let resp = await pool.query('SELECT * FROM usuarios WHERE email = ? AND pass = SHA(?)', [req.body.email,req.body.pass]);
  return resp.length ? resp[0] : false;
}

async function verificarAutoridad(req, id) {

  let resp = await pool.query('SELECT id,email FROM carreras WHERE id=? AND email=?', [id,req.session.user]);
  return resp.length ? true : false;
}

// Verifica que el usuario y rol concuerden con la bd
// y que sea el rol que se requiere (parametro rol)
async function isValidSessionAndRol(req, rol) {
  if(req.session.isPopulated){
    let resp = await pool.query('SELECT * FROM usuarios WHERE email = ? AND rol = ?', [req.session.user,req.session.rol]);
    if (resp.length) {
      return req.session.rol == rol;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

async function isValidSessionAndRol(req, rol1, rol2) {
  if(req.session.isPopulated){
    let resp = await pool.query('SELECT * FROM usuarios WHERE email = ? AND rol = ?', [req.session.user,req.session.rol]);
    if (resp.length) {
      return (req.session.rol == rol1 || req.session.rol == rol2);
    } else {
      return false;
    }
  } else {
    return false;
  }
}

module.exports = app;
