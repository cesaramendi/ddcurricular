$(document).ready(function () {

  $('.fecha').text((new Date().toLocaleString()));

  let dataProyectos = [];
  let datasesorias = [];
  let user;
  /*
  let tabla = $('#dataTable').DataTable({
    ajax: '/getProyectos',
    columns: [
      { data: 'id' },
      { data: 'nombreProyecto' },
      { data: 'responsables' },
      { data: 'ubicacionGeografica' },
      { data: 'tipo' },
      { data: 'status' },
    ],
    order: [[0, 'desc']],
    createdRow: function (row, data, dataIndex) {
      if (data.tipo == 1) {
        data.tipo = 'Pregrado';
      } else if (data.tipo == 2) {
        data.tipo = 'Posgredo';
      }
      switch (data.status) {
        case 0: data.status = 'esperando correccion'; break;
        case 1: data.status = 'recibido'; break;
        case 2: data.status = 'para revisar'; break;
        case 3: data.status = 'rechazado '; break;
        case 4: data.status = 'validado'; break;
        case 5: data.status = 'rechazado por consejo'; break;
        case 6: data.status = 'aprobado'; break;
        case 7: data.status = 'finalizado'; break;
      }
    },
    rowCallback: function (row, data) {
      if (data.tipo == 'Pregrado') {
        $('td:eq(4)', row).html('Pregrado');
      } else if (data.tipo == 'Posgredo') {
        $('td:eq(4)', row).html('Posgredo');
      }
      switch (data.status) {
        case 'esperando correccion': $('td:eq(5)', row).html('esperando correccion'); break;
        case 'recibido': $('td:eq(5)', row).html('recibido'); break;
        case 'para revisar': $('td:eq(5)', row).html('para revisar'); break;
        case 'rechazado': $('td:eq(5)', row).html('rechazado'); break;
        case 'validado': $('td:eq(5)', row).html('validado'); break;
        case 'rechazado por consejo': $('td:eq(5)', row).html('rechazado por consejo'); break;
        case 'aprobado': $('td:eq(5)', row).html('aprobado'); break;
        case 'finalizado': $('td:eq(5)', row).html('finalizado'); break;
      }
      $('td:eq(2)', row).html(data.responsables.split('\n')[0]);
    },
  });
*/
  //////////////////////////////////////////////////////////////////////////////
  let tablaA = $('#dataTableAsesoria').DataTable({
    ajax: '/getAsesorias',
    columns: [
      { data: 'idA' },
      { data: 'titulo' },
      { data: 'apellidoSolicitanteA' },
      { data: 'fechaCapacitacion' },
      { data: 'tipo' },
      { data: 'status' },
    ],
    order: [[0, 'desc']],
    createdRow: function (row, data, dataIndex) {
      switch (data.tipo) {
        case 1: data.tipo = 'Curso'; break;
        case 2: data.tipo = 'Taller'; break;
        case 3: data.tipo = 'Formacion'; break;
      }

      switch (data.status) {
        case 0: data.status = 'esperando correccion'; break;
        case 1: data.status = 'recibido'; break;
        case 2: data.status = 'para revisar'; break;
        case 3: data.status = 'rechazado por D.D.Curricular'; break;
        case 4: data.status = 'validado'; break;
        case 5: data.status = 'rechazado por consejo'; break;
        case 6: data.status = 'aprobado'; break;
        case 7: data.status = 'finalizado'; break;
      }
    },
    rowCallback: function (row, data) {
      switch (data.tipo) {
        case 'Curso': $('td:eq(4)', row).html('Curso'); break;
        case 'Taller': $('td:eq(4)', row).html('Taller'); break;
        case 'Formacion': $('td:eq(4)', row).html('Formacion'); break;
      }
      switch (data.status) {
        case 'esperando correccion': $('td:eq(5)', row).html('esperando correccion'); break;
        case 'recibido': $('td:eq(5)', row).html('recibido'); break;
        case 'para revisar': $('td:eq(5)', row).html('para revisar'); break;
        case 'rechazado por D.D.Curricular': $('td:eq(5)', row).html('rechazado por D.D.Curricular'); break;
        case 'validado': $('td:eq(5)', row).html('validado'); break;
        case 'rechazado por consejo': $('td:eq(5)', row).html('rechazado por consejo'); break;
        case 'aprobado': $('td:eq(5)', row).html('aprobado'); break;
        case 'finalizado': $('td:eq(5)', row).html('finalizado'); break;
      }
      //$('td:eq(2)', row).html(data.apellidoSolicitanteA.split('\n')[0]);
      $('td:eq(3)', row).html(data.fechaCapacitacion.split('T')[0]);
    },
  });

  tablaA.on('xhr', function () {
    datasesorias = tablaA.ajax.json().data;
  });

      $('#dataTableAsesoria tbody').on('click', 'tr', function () {
        let tr = $(this).closest('tr');
        let tdi = tr.find("i.fa");
        let row = tablaA.row(tr);
        let rowData = row.data();

        $('#projectModalAsesoria').addClass('isloading');
        $("#projectModalAsesoria").modal('toggle');
        $('#projectModalAsesoria').off('shown.bs.modal').on('shown.bs.modal', function () {

          let fields = {};
          fields.idA = document.getElementById('projectModalLabelA');
          fields.tituloA = document.getElementById('projectModalTitulo');
          fields.tipoA = document.getElementById('projectModalTipoA');
          fields.statusA = document.getElementById('projectModalStatusA');
          fields.fechaA = document.getElementById('projectModalFechaA');
          fields.solicitanteA = document.getElementById('projectModalSolicitanteA');
          fields.participantesA = document.getElementById('projectModalCantParticipantes');
          fields.fechaCapacitacion = document.getElementById('projectModalFechaCapacitacion');
          fields.lugarA = document.getElementById('projectModalLugar');
          fields.introduccionA = document.getElementById('projectModalIntroduccionA');

          fields.pluses = document.getElementById('projectModalPlusesA');
          ///////////////

          fields.idA.innerText = 'Solicitud Asesoria ID: ' + rowData.idA;
          fields.tituloA.innerText = rowData.titulo;
          fields.tipoA.innerText = rowData.tipo;
          fields.fechaA.innerText = rowData.fechaSolicitudA.split('T')[0];
          fields.solicitanteA.innerText = rowData.apellidoSolicitanteA+' '+rowData.nombreSolicitanteA;
          fields.participantesA.innerText = rowData.cantidadParticipantes;
          fields.fechaCapacitacion.innerText = rowData.fechaCapacitacion.split('T')[0];
          fields.lugarA.innerText = rowData.lugar;
          fields.introduccionA.innerText = rowData.introduccion;


          // Para mostrar detalles segun estatus
          let plusesHtml = '';
          plusesHtml = `<br>
          <table id="projectPlusesA" class="table-bordered"
          cellpadding="5" cellspacing="0" border="0"
          style="padding-left:50px; margin:auto;">
          <tr>
          <td>Estatus:</td>
          <td>${rowData.status}</td>
          </tr>
          <tr>
          <td>Nota:</td>
          <td>${rowData.nota ? rowData.nota:''}</td>
          </tr>
          </table>
          <br>`;

          fields.pluses.innerHTML = plusesHtml;
        });
      });

/////////////////////////////////////////////////////////////////////////////


  let tabla = $('#dataTable').DataTable({
    ajax: '/getProyectosDDC',
    columns: [
      { data: 'id' },
      { data: 'nombreSolicitud' },
      { data: 'apellidoSolicitante' },
      { data: 'coordinador' },
      { data: 'tipo' },
      { data: 'status' },
    ],
    order: [[0, 'desc']],
    createdRow: function (row, data, dataIndex) {
      switch (data.tipo) {
        case 1: data.tipo = 'Pregrado'; break;
        case 2: data.tipo = 'Postgrado'; break;
        case 3: data.tipo = 'Diplomado'; break;
      }

      switch (data.status) {
        case 0: data.status = 'esperando correccion'; break;
        case 1: data.status = 'recibido'; break;
        case 2: data.status = 'para revisar'; break;
        case 3: data.status = 'rechazado por D.D.Curricular'; break;
        case 4: data.status = 'validado'; break;
        case 5: data.status = 'rechazado por consejo'; break;
        case 6: data.status = 'aprobado'; break;
        case 7: data.status = 'finalizado'; break;
      }
    },
    rowCallback: function (row, data) {
      switch (data.tipo) {
        case 'Pregrado': $('td:eq(4)', row).html('Pregrado'); break;
        case 'Postgrado': $('td:eq(4)', row).html('Postgrado'); break;
        case 'Diplomado': $('td:eq(4)', row).html('Diplomado'); break;
      }
      switch (data.status) {
        case 'esperando correccion': $('td:eq(5)', row).html('esperando correccion'); break;
        case 'recibido': $('td:eq(5)', row).html('recibido'); break;
        case 'para revisar': $('td:eq(5)', row).html('para revisar'); break;
        case 'rechazado por D.D.Curricular': $('td:eq(5)', row).html('rechazado por D.D.Curricular'); break;
        case 'validado': $('td:eq(5)', row).html('validado'); break;
        case 'rechazado por consejo': $('td:eq(5)', row).html('rechazado por consejo'); break;
        case 'aprobado': $('td:eq(5)', row).html('aprobado'); break;
        case 'finalizado': $('td:eq(5)', row).html('finalizado'); break;
      }
      $('td:eq(2)', row).html(data.apellidoSolicitante.split('\n')[0]);
    },
  });

  tabla.on('xhr', function () {
    dataProyectos = tabla.ajax.json().data;
  });

///////////////////////////////////////////////////////////////////////////////

  $('#dataTable tbody').on('click', 'tr', function () {
    let tr = $(this).closest('tr');
    let tdi = tr.find("i.fa");
    let row = tabla.row(tr);
    let rowData = row.data();

    $('#projectModal').addClass('isloading');
    $("#projectModal").modal('toggle');
    $('#projectModal').off('shown.bs.modal').on('shown.bs.modal', function () {

      let fields = {};
      fields.id = document.getElementById('projectModalLabel');
      fields.nombreP = document.getElementById('projectModalNombre');
      fields.tipoP = document.getElementById('projectModalTipoP');
      fields.statusP = document.getElementById('projectModalStatusP');
      fields.fechaP = document.getElementById('projectModalFechaP');
      fields.solicitanteP = document.getElementById('projectModalSolicitanteP');
      fields.disennoP = document.getElementById('projectModalDisennoP');
      fields.coordinadorP = document.getElementById('projectModalCoordinadorP');
      fields.introduccionP = document.getElementById('projectModalIntroduccionP');
      fields.participantesP = document.getElementById('projectModalParticipantesP');
      fields.descripcionP = document.getElementById('projectModalDescripcionP');

      fields.filesHeads = document.getElementById('projectModalFilesHeads');
      fields.files = document.getElementById('tableProjectFiles');
      fields.pluses = document.getElementById('projectModalPluses');

      fields.id.innerText = 'Proyecto id: ' + rowData.id;
      fields.nombreP.innerText = rowData.nombreSolicitud;
      fields.tipoP.innerText = rowData.tipo;
      fields.fechaP.innerText = rowData.fechaSolicitud.split('T')[0];
      //fields.statusP.innerText = rowData.status;
      /*fields.fechaP.innerText = (new Date(rowData.fecha)) == 'Invalid Date' ? rowData.fecha.split('T')[0] : (new Date(rowData.fecha)).toLocaleDateString();*/
      fields.solicitanteP.innerText = rowData.apellidoSolicitante+' '+rowData.nombreSolicitante;
      fields.disennoP.innerText = rowData.disenno;
      fields.coordinadorP.innerText = rowData.coordinador;
      fields.introduccionP.innerText = rowData.introduccion;
      fields.participantesP.innerText = rowData.participantes;
      fields.descripcionP.innerText = rowData.descripcion;


      // Para mostrar los documentos del proyecto
      $.ajax({
        method: 'get',
        url: '/getDocsFromProject?id=' + rowData.id,
      }).done(function (res) {
        $('#projectModal').removeClass('isloading');
        rowData.files = res.data;
        // Obtenemos cuantos tipos de documentos tiene el proyecto
        let nTipos = [];
        for (let i = 0; i < res.data.length; i++) {
          if (!nTipos.find(x => x == res.data[i].tipo)) nTipos.push(res.data[i].tipo);
        };
        nTipos.sort();
        //Se obtiene un arreglo donde cada indice tiene todos los documentos de un mismo tipo
        let filesByTipo = [];
        let cabeceraHtml = '';
        for (let i = 0; i < nTipos.length; i++) {
          let cabecera = '';
          switch (nTipos[i]) {
            case 1: cabecera = 'Originales'; break;
            case 2: cabecera = 'Actualizados'; break;
            case 3: cabecera = 'Aval'; break;
            case 4: cabecera = 'Avances'; break;
            case 5: cabecera = 'Final'; break;
          };
          if (cabecera != 'Avances') cabeceraHtml = cabeceraHtml + `<th>${cabecera}</th>`;
          filesByTipo.push(res.data.filter(x => x.tipo == nTipos[i]));
        }
        fields.filesHeads.innerHTML = cabeceraHtml;
        // Obtenemos el maximo doc.numero
        let maxNumero = Math.max.apply(Math, res.data.map(x => x.numero));
        let htmlFiles = '';
        for (let k = 0; k < maxNumero; k++) {
          htmlFiles = htmlFiles + `<tr>`;
          for (let i = 0; i < filesByTipo.length; i++) {
            filesByTipo[i].sort((a, b) => a.numero - b.numero);
            if(filesByTipo[i][0].tipo != 4){
              if (filesByTipo[i][k]) {
                htmlFiles = htmlFiles +
                `<td><a target="_blank" href="${filesByTipo[i][k].ruta}">Archivo ${filesByTipo[i][k].numero}</a></td>`;
              } else {
                htmlFiles = htmlFiles +
                ``;
              }
            }
          }
          htmlFiles = htmlFiles + `</tr>`;
        }
        fields.files.innerHTML = htmlFiles;

        // PAra mostrar el select de estatus si aun no está aprobado
        let selectHtml = `
        <div class="input-group mb-3 descoDetails">
          <div class="input-group-prepend">
            <label class="input-group-text" for="status">Estatus</label>
          </div>
          <select required name="status" class="custom-select" id="status">
            <option value="0" ${status2Num(rowData.status) == 0 ? 'selected' : ''}>${num2Status(0)}</option>
            <option value="1" ${status2Num(rowData.status) == 1 ? 'selected' : ''}>${num2Status(1)}</option>
            <option value="2" ${status2Num(rowData.status) == 2 ? 'selected' : ''}>${num2Status(2)}</option>
            <option value="3" ${status2Num(rowData.status) == 3 ? 'selected' : ''}>${num2Status(3)}</option>
            <option value="4" ${status2Num(rowData.status) == 4 ? 'selected' : ''}>${num2Status(4)}</option>
            <option value="5" ${status2Num(rowData.status) == 5 ? 'selected' : ''}>${num2Status(5)}</option>
            <option value="6" ${status2Num(rowData.status) == 6 ? 'selected' : ''}>${num2Status(6)}</option>
          </select>
        </div>
        <input class="btn btn-primary btn-block descoDetails" type="submit" value="Actualizar">`;
        let textStatusHtml = `
        <div class="form-group descoDetails" >
          <div class="form-label-group mx-auto" style="width: fit-content">
            <input value="${rowData.status}" id="status" class="form-control text-center" placeholder="Estatus" disabled name="status">
            <label for="status">Estatus</label>
          </div>
        </div>
        <br>`


        // Para mostrar detalles segun estatus
        let plusesHtml = '';
        plusesHtml =
        `<form method="post" action="/carreraUpdate">
          <input class="d-none" name="id" value="${rowData.id}"></id>
          <div class="form-group descoDetails">
            <label for="nota">Nota  para el usuario que subió el proyecto</label>
            <textarea ${status2Num(rowData.status) >= 6? 'disabled' : ''} class="form-control descoDetails" id="nota" name="nota">${rowData.nota ? rowData.nota : ''}</textarea>
          </div>
          <br>
          ${status2Num(rowData.status) >= 6? textStatusHtml : selectHtml}
        </form>`;


        // Si está aprobado & no ha subido el aval
        if (status2Num(rowData.status) >= 6 && !(filesByTipo.find(x => x[0].tipo == 3)) ) { // Falta modificar para que ingrese aval, no cualquier archivo
          plusesHtml = plusesHtml +
            `<span>Subir oficio de aval.</span>
            <form method="post" action="/subirAval" enctype="multipart/form-data">
          <input class="d-none" type="text" name="nombreProyecto" value="${rowData.nombreProyecto}"/>
          <input class="d-none" name="tipo" value="${tipo2Num(rowData.tipo)}"/>
          <input class="d-none" name="refProyecto" value="${rowData.id}"/>`;
            plusesHtml = plusesHtml +
              `<div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">Aval</span>
            </div>
            <div class="custom-file">
              <input type="file" class="custom-file-input" name="aval" id="aval" accept=".pdf, .doc, .docx, .xlsx">
              <label id="avalLabel" class="custom-file-label" for="aval">Escoger Archivo PDF, Word, Excel</label>
            </div>
          </div>`
          plusesHtml = plusesHtml +
            `<input class="btn btn-primary mx-auto d-block" type="submit" value="Actualizar">
          </form>`;
        }

        fields.pluses.innerHTML = plusesHtml;

        // Si esta aprobado
        if(status2Num(rowData.status) >= 6) {
          fields.pluses.innerHTML = fields.pluses.innerHTML +
          `<div class="text-right text-white">


          </div>`;

          $('.2ndModal').on('click', function(ev) {
            ev.preventDefault();
            let altura = document.getElementById('projectModal').scrollTop;
            let projectModal = $('#projectModal');
            let targetModal;
            switch(this.innerText){
              case 'Ver participantes': targetModal = $('#participantesModal'); break;
              case 'Ver avances': targetModal = $('#avancesModal'); break;
            }

            projectModal.modal('hide');
            projectModal.on('hidden.bs.modal', function () {
              targetModal.modal('show');
              projectModal.off('hidden.bs.modal');
            });
            targetModal.on('hidden.bs.modal', function () {
              projectModal.modal('show');
              projectModal.on('shown.bs.modal', function () {
                this.scrollTop = altura; // Baja el modal hasta el final
                projectModal.off('shown.bs.modal');
              });
              targetModal.off('hidden.bs.modal');
            });
          });
        } // fin if(aprobado)

        // Definicion del comportamiento al abrir los diferentes modales
        let avancesModal = $('#avancesModal');
        let participantesModal = $('#participantesModal');

        participantesModal.off('show.bs.modal').on('show.bs.modal', function() {
          let participantesHtml = `
          <table class="table">
            <thead>
              <tr class="text-center">
                <td>Nombre</td>
                <td>Apellido</td>
                <td>Cedula</td>
                <td>Lugar</td>
                <td>Genero</td>
                <td>Nacimiento</td>
              </tr>
            </thead>
            <tbody class="text-center">

          `
          $('#participantesModalTitle').text(rowData.nombreProyecto);
          $.ajax({
            method: 'get',
            url: '/getParticipantesFromProject?id=' + rowData.id,
          }).done(function(res){
            for (let i = 0; i < res.data.length; i++) {
              participantesHtml = participantesHtml + `
              <tr>
                <td>${res.data[i].nombre}</td>
                <td>${res.data[i].apellido}</td>
                <td>${res.data[i].cedula}</td>
                <td>${res.data[i].lugar}</td>
                <td>${res.data[i].genero}</td>
                <td>${(new Date(res.data[i].nacimiento)).toLocaleDateString()}</td>
              </tr>
              `;
            }
            participantesHtml += '</tbody></table>';
            document.getElementById('participantesModalBody').innerHTML = participantesHtml;
          });
        });

        avancesModal.off('show.bs.modal').on('show.bs.modal', function() {
          let avancesHtml = '';
          $('#avancesModalTitle').text(rowData.nombreProyecto);
          $.ajax({
            method:'get',
            url: '/getAvancesFromProject?id=' + rowData.id,
          }).done(function(res){
            for(let i = 0; i < res.data.length; i++) {
              // Verificación en caso de que haya avances pero no haya el aval
              let numTipo = filesByTipo[3] ? 3 : 2;
              let avancesIds = uniqueArrayDocsObjects(filesByTipo[numTipo]);
              avancesHtml = avancesHtml + `
                <h6>Avance ${i+1} <small>${(new Date(res.data[i].fecha)).toLocaleDateString()}</small></h6>
                <div>

                </div>
                <div>
                  ${res.data[i].nota}
                </div>
              `

              let docsFromiAvance = filesByTipo[numTipo].filter(x => x.refAvance == avancesIds[i]);
              for(let j = 0; j < docsFromiAvance.length; j++) {
                avancesHtml = avancesHtml + `
                  <a target="_blank" href="${docsFromiAvance[j].ruta}">Archivo ${j+1}</a>
                `
              }
              avancesHtml += '<hr>';
            }
            document.getElementById('avancesModalBody').innerHTML = avancesHtml;
          });
        }); // fin evento aparicion avances modal


        //colorear en rojo la tabla de estatus
        if (status2Num(rowData.status) == 0) $('#projectPluses').addClass('atention');

        $('.custom-file-input').change(function (e) {
          let campoInputFile = document.getElementById('aval' + 'Label');
          campoInputFile.innerText = $('#' + 'aval').val().replace('C:\\fakepath\\', '');

        })
      });// fin ajax proyectos
    });// fin evento modal

  });// evento click table

  function status2Num(status) {
    switch (status) {
      case 'Nuevo': return 0; break;
      case 'recibido': return 1; break;
      case 'para revisar': return 2; break;
      case 'rechazado por D.D.Curricular': return 3; break;
      case 'validado': return 4; break;
      case 'rechazado por consejo': return 5; break;
      case 'aprobado': return 6; break;
      case 'finalizado': return 7; break;
    }
  }

  function num2Status(num) {
    switch (num) {
      case 0: return 'Nuevo'; break;
      case 1: return 'recibido'; break;
      case 2: return 'En revision'; break;
      case 3: return 'rechazado por error de carga'; break;
      case 4: return 'validado'; break;
      case 5: return 'rechazado por Curriculum'; break;
      case 6: return 'aprobado'; break;
      case 7: return 'finalizado'; break;
    }
  }

  function tipo2Num(tipo) {
    switch (tipo) {
      case 'Servicio Comunitario': return 1; break;
      case 'Extensión': return 2; break;
    }
  }

  function uniqueArrayDocsObjects( ar ) {
    var j = {};

    ar.forEach( function(v) {
      j[v.refAvance+ '::' + typeof v.refAvance] = v.refAvance;
    });

    return Object.keys(j).map(function(v){
      return j[v];
    });
  }

});
