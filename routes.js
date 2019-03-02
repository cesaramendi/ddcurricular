const express = require('express');
const multer = require('multer');
const pool = require('./bd.js');
const app = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Elije la carpeta donde guardar segun el tipo de proyecto
    console.log("Tipo en Documento: ",req.body.tipo);
    let tipo = '';
    if (req.body.tipo == 1) {
      tipo = 'Carreras/';
    }else if (req.body.tipo == 2) {
      tipo = 'Postgrados/';
    }else {
      tipo = 'Programas/';
    }
    cb(null, 'Documentos/' + tipo);
  },
  filename: function (req, file, cb) {
    console.log("el file:", file);
    // Extraemos la extension del archivo
    let ext = file.originalname.split('.');
    ext = ext[ext.length - 1];
   console.log("El body de la 18: ",req.body)
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
//// 2: Burocratas
//// 3: Facultad

//GET Requests ------------------------------------

app.get('/dashboard', (req, res) => {
  if(req.session.rol == 1) {
    send(res, 'admin/dashboard.html');
  } else if(req.session.rol == 2) {
    send(res, 'burocratas/dashboard.html');
  } else if(req.session.rol == 3) {
    send(res, 'facultad/dashboard.html');
  } else {
    forbid(res);
  }
});

app.get('/phpmiadministrador', (req, res) => {
  if(true) {
    send(res, '/#');
    //send(res, './phpmyadmin/index.php');
  } else {
    forbid(res);
  }
});

app.get('/enviarSolicitudAsesoria', asyncMiddleware( async(req, res) => {
   send(res, 'facultad/enviarSolicitudAsesoria.html');
}));

app.get('/Reporte', (req, res) => {
  if(req.session.rol == 2) {
    send(res, 'burocratas/Reporte.html');
  } else if(req.session.rol == 3) {
    send(res, 'facultad/Reporte.html');
  } else {
    forbid(res);
  }
});

app.get('/enviarSolicitudAval', asyncMiddleware( async (req, res) => {
  if(true) {
    send(res, 'facultad/enviarSolicitudAval.html');
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

}));
app.get('/enviarSolicitudAval', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 3)) {
    send(res, 'facultad/enviarSolicitudAval.html');
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

app.get('/getDocsFromSolicitudAval', asyncMiddleware( async (req, res) => {
  if(Number.isSafeInteger(Number(req.query.id)) && await isValidSessionAndRol(req, 2, 3)) {
    let data = await pool.query('SELECT ruta,tipo,numero FROM documentoSolicitudAval WHERE refProyecto=?',[req.query.id]);
    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/getDocsFromAsesoria', asyncMiddleware( async (req, res) => {
  if(Number.isSafeInteger(Number(req.query.id)) && await isValidSessionAndRol(req, 2, 3)) {
    let data = await pool.query('SELECT ruta,tipo,numero FROM DocumentoAsesoria WHERE refProyectoA=?',[req.query.id]);
    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/getDocsFromInvestigacion', asyncMiddleware( async (req, res) => {
  if(Number.isSafeInteger(Number(req.query.id)) && await isValidSessionAndRol(req, 2, 3)) {
    let data = await pool.query('SELECT ruta,tipo,numero,refProyecto FROM documentoInvestigacion WHERE refProyecto=?',[req.query.id]);
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

app.get('/getSolicitudAvalCorregir', asyncMiddleware( async (req, res) => {
  if(Number.isSafeInteger(Number(req.query.id)) && await isValidSessionAndRol(req, 3)) {
    let data = await pool.query('SELECT * FROM SolicitudAval WHERE id=?',[req.query.id]);
    console.log(data);
    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/getAsesoriaCorregir', asyncMiddleware( async (req, res) => {
  if(Number.isSafeInteger(Number(req.query.id)) && await isValidSessionAndRol(req, 3)) {
    let data = await pool.query('SELECT * FROM Asesoria WHERE idA=?',[req.query.id]);
    console.log(data);
    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/getInvestigacionCorregir', asyncMiddleware( async (req, res) => {
  if(Number.isSafeInteger(Number(req.query.id)) && await isValidSessionAndRol(req, 3)) {
    let data = await pool.query('SELECT * FROM investigacion WHERE id=?',[req.query.id]);
    console.log(data);
    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/buscarPersona', asyncMiddleware( async (req, res) => {
  if(Number.isSafeInteger(Number(req.query.cedula)) && await isValidSessionAndRol(req, 3)) {
    let data = await pool.query('SELECT * FROM persona WHERE nacionalidad=? AND cedula=?',[req.query.nacionalidad,req.query.cedula]);
    console.log(data);
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

app.get('/getPersonas', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 1)) {
    let data = await pool.query('SELECT * FROM persona');
    res.json({ data });
  } else {
    forbid(res);
  }
}) );
////////////////////////Reportes//////////////////////////////////////////////

app.get('/getSolicitudAvalCantTipos', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 2, 3)) {
    let data;
    if(req.session.rol == 3) {
      data = await pool.query('SELECT tipo, COUNT(tipo) AS cant FROM SolicitudAval WHERE email=? GROUP BY tipo',[req.session.user]);
    } else {
      data = await pool.query('SELECT tipo, COUNT(tipo) AS cant FROM SolicitudAval GROUP BY tipo');
    }
    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/getSolicitudAvalCantStatus', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 2, 3)) {
    let data;
    if(req.session.rol == 3) {
      data = await pool.query('SELECT status, COUNT(status) AS cant FROM SolicitudAval WHERE email=? GROUP BY status',[req.session.user]);
    } else {
      data = await pool.query('SELECT status, COUNT(status) AS cant FROM SolicitudAval GROUP BY status');
    }
    res.json({ data });
  } else {
    forbid(res);
  }
}) );
///////////////////////////////////////////////////////////////////////////////

app.get('/getSolicitudAval', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 2, 3)) {
    console.log(req.session);
    let data;
    if(req.session.rol == 3) {
      data = await pool.query('SELECT * FROM SolicitudAval WHERE email=?',[req.session.user]);
    } else {
      data = await pool.query('SELECT * FROM SolicitudAval');
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
      data = await pool.query('SELECT * FROM Asesoria WHERE emailA=?',[req.session.user]);
    }else if (req.session.rol == 2) {
      data = await pool.query('SELECT * FROM Asesoria');
    }

    res.json({ data });
  } else {
    forbid(res);
  }
}) );

app.get('/getInvestigacion', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 2, 3)) {
    let data;
    if(req.session.rol == 3) {
      data = await pool.query('SELECT * FROM actualizacion WHERE email=?',[req.session.user]);
    } else {
      data = await pool.query('SELECT * FROM actualizacion');
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

app.get('/', (req, res) => {
  if(req.session.isPopulated) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/');
  }
});

app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
})


app.get('/Documentos/:tipo/:nombre', (req, res) => { //ruta para documentos
  console.log(req.params);
  res.sendFile(`${req.params.tipo}/${req.params.nombre}`, {root: __dirname + '/Documentos/'});
})

app.get('/register', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 1)) {
    send(res, 'admin/register.html');
  } else {
    forbid(res);
  }
}) );

app.get('/registerPersona', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 1)) {
    send(res, 'admin/registerPersona.html');
  } else {
    forbid(res);
  }
}) );

app.get('/success', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 3, 2)) {
    if(req.session.rol == 3){
      send(res, 'facultad/success.html');
    }else if(req.session.rol == 2) {
      send(res, 'burocratas/success.html');
    }
  } else {
    forbid(res);
  }
}) );
////////////////////////correcciones////////////////////////////////////////////

app.get('/enviarSolicitudAvalCorregido', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 3)) {
    send(res, 'facultad/correcciones/enviarSolicitudAvalCorregido.html');
  } else {
    forbid(res);
  }
}) );

app.get('/enviarInvestigacionCorregido', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 3)) {
    send(res, 'facultad/correcciones/enviarSolicitudInvestigacionCorregido.html');
  } else {
    forbid(res);
  }
}) );

app.get('/enviarAsesoriaCorregido', asyncMiddleware( async (req, res) => {
  if(await isValidSessionAndRol(req, 3)) {
    send(res, 'facultad/correcciones/enviarSolicitudAsesoriaCorregido.html');
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
          await pool.query('UPDATE SolicitudAval SET status=1 WHERE id=?',[req.body.refProyecto]);
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


app.post('/solicitudAvalUpdate', asyncMiddleware( async (req, res) => {
  console.log(req.body);
  if (await isValidSessionAndRol(req, 2)) {
    let nota = req.body.nota == ''? null : req.body.nota;
    await pool.query('UPDATE SolicitudAval SET nota=?, status=?,fechaStatus=? WHERE id=?', [nota, req.body.status,dformat(), req.body.id]);
    res.redirect('/dashboard');
  } else {
    forbid(res);
  }
}) );

app.post('/asesoriaUpdate', asyncMiddleware( async (req, res) => {
  console.log(req.body);
  if (await isValidSessionAndRol(req, 2)) {
    let nota = req.body.nota == ''? null : req.body.nota;
    await pool.query('UPDATE Asesoria SET notaA=?, statusA=?,fechaStatusA=? WHERE idA=?', [nota, req.body.status,dformat(), req.body.id]);
    res.redirect('/dashboard');
  } else {
    forbid(res);
  }
}) );

app.post('/investigacionUpdate', asyncMiddleware( async (req, res) => {
  console.log(req.body);
  if (await isValidSessionAndRol(req, 2)) {
    let nota = req.body.nota == ''? null : req.body.nota;
    await pool.query('UPDATE Investigacion SET nota=?, status=?,fechaStatus=? WHERE id=?', [nota, req.body.statusI,dformat(), req.body.idI]);
    res.redirect('/dashboard');
  } else {
    forbid(res);
  }
}) );

app.post('/solicitudAvalCorregir', asyncMiddleware( async (req, res) => {
  //console.log(req.body);
  if (await isValidSessionAndRol(req, 3)) {
    let proyData = [
      //req.session.user, // email
      req.body.nombreSolicitud,
      req.body.solicitud,
      /* ^ tipo-------------------------
      /* 1: Creacion
      /* 2: Redisenno
      /* ------------------------------*/
      req.body.tipo,
      /* ^ asunto-------------------------
      /* 1: Creacion
      /* 2: Diplomado
      /* 3: Programa academico
      /* ------------------------------*/
      req.body.institucion,
      req.body.dependencia,
      req.body.disennador,
      req.body.coordinador,
      req.body.descripcion,
      req.body.miembros,
      1,
      dformat(),
      req.body.id,
      req.session.user,
    ]
    console.log(proyData);

    await pool.query('UPDATE SolicitudAval SET nombreSolicitud=?, solicitud=?, tipo=?, institucion=?, dependencia=?, disennador=?, coordinador=?, descripcion=?, miembros=?, status=?,fechaStatus=? WHERE id=? AND email=?', proyData);

    res.redirect('/success');
  } else {
    forbid(res);
  }
}) );

app.post('/asesoriaCorregir', asyncMiddleware( async (req, res) => {
  console.log(req.body);
  if (await isValidSessionAndRol(req, 3)) {
    let proyData = [
      req.body.nombreSolicitud,
      req.body.etapa,
      req.body.tipoA,
      /* ^ tipo-------------------------
      /* 1: Carrera
      /* 2: Diplomado
      /* 3: Programa Academico
      /* ------------------------------*/
      req.body.institucionA,
      req.body.dependenciaA,
      req.body.cantidadBeneficiarios,
      req.body.lugar,
      req.body.fechaAsesoria,
      req.body.horaAsesoria,
      req.body.descripcionA,
      1,
      dformat(),
      req.body.idA,
      req.session.user, // email
    ]

    await pool.query('UPDATE Asesoria SET nombreSolicitudA=?, etapa=?, tipoA=?, institucionA=?, dependenciaA=?, cantidadVeneficiarios=?, lugar=?, fechaAsesoria=?, horaAsesoria=?, descripcionA=?, statusA=?,fechaStatusA=? WHERE idA=? AND emailA=?', proyData);

    res.redirect('/success');
  } else {
    forbid(res);
  }
}) );

app.post('/investigacionCorregir', asyncMiddleware( async (req, res) => {
  console.log(req.body);
  if (await isValidSessionAndRol(req, 3)) {
    //var d = new Date();
    let proyData = [
      req.body.nombreSolicitudI,
      req.body.solicitudI,
      /* ^ tipo-------------------------
      /* 1: Creacion
      /* 2: Redisenno
      /* ------------------------------*/
      req.body.tipoI,
      /* ^ asunto-------------------------
      /* 1: Creacion
      /* 2: Diplomado
      /* 3: Programa academico
      /* ------------------------------*/
      req.body.institucionI,
      req.body.dependenciaI,
      req.body.descripcionI,
      1,
      dformat(),
      req.body.idI,
      req.session.user,
    ]

    await pool.query('UPDATE Investigacion SET nombreSolicitudI=?, solicitudI=?, tipoI=?, institucionI=?, dependenciaI=?, descripcionI=?, statusI=?,fechaStatusI=? WHERE idI=? AND emailI=?', proyData);

    res.redirect('/success');
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

app.post('/login', asyncMiddleware( async(req, res) => {
  let user = await verificarUser(req);
  if(user) { //valid user
    req.session.user = user.email;
    req.session.rol = user.rol;
    req.session.theme = 0;
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

app.post('/registerPersona', asyncMiddleware( async (req, res) => {
  let person = req.body;
  if (await isValidSessionAndRol(req, 1)) {
    await pool.query('INSERT INTO persona VALUES (?,?,?,?)', [person.nacionalidad, person.cedula, person.apellido, person.nombre]);
    res.redirect('/dashboard');
  } else {
    forbid(res);
  }
}) );

app.post('/enviarSolicitudAsesoria', asyncMiddleware( async(req, res) => {
   send(res, 'facultad/enviarSolicitudAsesoria.html');
}))

app.get('/enviarSolicitudInvestigacion', asyncMiddleware( async(req, res) => {
   send(res, 'facultad/enviarSolicitudInvestigacion.html');
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
        await pool.query('UPDATE SolicitudAval SET status=7 WHERE id=? ', [req.body.refProyecto]);
        res.redirect('/success');
      }
    });

  } else {
    forbid(res);
  }
}) );

app.post('/subirAvalInvestigacion', asyncMiddleware(async (req, res) =>{
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
        await pool.query('INSERT INTO documentos VALUES(0,NULL,?,?,?,NOW(),3,1)', dataDoc);
        await pool.query('UPDATE actualizacion SET status=7 WHERE id=? ', [req.body.refProyecto]);
        res.redirect('/success');
      }
    });

  } else {
    forbid(res);
  }
}) );

app.post('/uploadSolicicitudAval', upload.array('inputFile', 10),asyncMiddleware(async (req, res) => {
  console.log(req.body);
  console.log(req.files);
  if (await isValidSessionAndRol(req,3)) {
    let proyData = [
      req.session.user, // email
      req.body.nombreSolicitud,
      req.body.solicitud,
      /* ^ tipo-------------------------
      /* 1: Creacion
      /* 2: Redisenno
      /* ------------------------------*/
      req.body.tipo,
      /* ^ asunto-------------------------
      /* 1: Carrera
      /* 2: Diplomado
      /* 3: Programa academico
      /* ------------------------------*/
      req.body.institucion,
      req.body.dependencia,
      req.body.disennador,
      req.body.coordinador,
      req.body.descripcion,
      req.body.miembros,
      1,
      /* ^ status-----------------------
      /* 0: esperando correccion
      /* 1: recibido
      /* 2: para revisar
      /* 3: devuelto
      /* 4: validado
      /* 5: rechazado por consejo
      /* 6: aprobado
      /* 7: finalizado
      /* ------------------------- */
      dformat()
    ]
    let qryRes = await pool.query('INSERT INTO SolicitudAval VALUES(0,?,CURDATE(),?,?,?,?,?,?,?,?,?,?,?,NULL)', proyData);
    for(let i = 0; i < req.files.length; i++) {
      let docData = [
        //id: 0: auto
        qryRes.insertId,
        req.files[i].path,
        req.files[i].filename,
        (new Date()).toISOString().split('T')[0], // Obtiene solo la fecha en formato yyyy-mm-dd
        //tipo: inicio, actualizado, etc.
        i+1,
      ];
      console.log(docData);
      await pool.query('INSERT INTO documentoSolicitudAval VALUES(0,?,?,?,?,1,?)', docData);
      await pool.query('INSERT INTO documentoSolicitudAval VALUES(0,?,?,?,?,2,?)', docData);
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
      req.body.nombreSolicitud,
      req.body.etapa,
      /* ^ tipo-------------------------
      -- 1: Diagnostico
      -- 2: Disenno
      -- 3: Ejecusion
      -- 4: Evaluacion
      ------------------------------*/
      req.body.tipo,
      /* ^ tipo-------------------------
      -- 1: Carrera
      -- 2: Programa de postgrado
      -- 3: Programa academico
        ------------------------------*/
      req.body.institucion,
      req.body.dependencia,
      req.body.comunidad,
      req.body.cantidadBeneficiarios,
      req.body.lugar,
      req.body.fechaAsesoria,
      req.body.horaAsesoria,
      req.body.descripcion,
      1,
      /* ^ status-----------------------
      /* 0: esperando correccion
      /* 1: recibido
      /* 2: para revisar
      /* 3: Devuelto por correcciones
      /* 4: validado
      /* 5: rechazado por consejo
      /* 6: aprobado
      /* 7: finalizado
      /* ------------------------- */
      dformat()
    ]
    let qryRes = await pool.query('INSERT INTO Asesoria VALUES(0,?,CURDATE(),?,?,?,?,?,?,?,?,?,?,?,?,?,NULL)', asesoData);
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
      await pool.query('INSERT INTO DocumentoAsesoria VALUES(0,?,?,?,?,1,?)', docData);
      await pool.query('INSERT INTO DocumentoAsesoria VALUES(0,?,?,?,?,2,?)', docData);
    }
    res.redirect('/success');
  } else {
    forbid(res);
  }

}) );


app.post('/uploadSolicitudInvestigacion', upload.array('inputFile', 10),asyncMiddleware(async (req, res) => {
  console.log("*/uploadSolicitudInvestigacion*")
  console.log(req.body);
  //console.log("El user, asumo yo: ",req.session)
  console.log(req.files);
  if (await isValidSessionAndRol(req,3)) {
    let asesoData = [
      req.session.user,
      req.body.nombreSolicitud,
      req.body.solicitud,
      /* ^ Solicitud-------------------------
      /* 1: Creacion
      /* 2: Rediseño
      /* ------------------------------*/
      req.body.tipo,
      /* ^ tipo-------------------------
      /* 1: Carrera
      /* 2: Diplomado
      /* 3: Programa Academico
      /* ------------------------------*/
      req.body.nacionalidad,
      req.body.cedula,
      req.body.institucion,
      req.body.dependencia,
      req.body.descripcion,
      1,
      dformat()
    ]
    let fecha= (new Date()).toISOString().split('T')[0]
    let qryRes = await pool.query('INSERT INTO actualizacion VALUES(0,?,CURDATE(),?,?,?,?,?,?,?,?,?,?,NULL)', asesoData);

    console.log("El pakage a enviar: ", asesoData)
    console.log("El qryRes: ", qryRes)
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
      await pool.query('INSERT INTO documentos VALUES(0,NULL,?,?,?,?,1,?)', docData);
      await pool.query('INSERT INTO documentos VALUES(0,NULL,?,?,?,?,2,?)', docData);
    }
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

Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
}

function dformat(){
  var d = new Date,
    dformat = [d.getFullYear(),
              (d.getMonth()+1).padLeft(),
               d.getDate().padLeft()].join('-') +' ' +
              [d.getHours().padLeft(),
               d.getMinutes().padLeft(),
               d.getSeconds().padLeft()].join(':');
  return dformat;
}

// Verifica que el usuario y la clave coincidan
async function verificarUser(req) {
  console.log('verificarUser');
  console.log(req.body.email);
  let resp = await pool.query('SELECT * FROM usuarios WHERE email = ? AND pass = SHA(?)', [req.body.email,req.body.pass]);
  return resp.length ? resp[0] : false;
}

async function verificarAutoridad(req, id) {

  let resp = await pool.query('SELECT id,email FROM SolicitudAval WHERE id=? AND email=?', [id,req.session.user]);
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
