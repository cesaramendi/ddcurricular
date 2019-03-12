$(document).ready(function () {

  $('.fecha').text((new Date().toLocaleString()));

  //////////////////////////////////////////////////////////////////////////////
  let tablaA = $('#dataTableAsesoria').DataTable({
    ajax: '/getAsesorias',
    columns: [
      { data: 'idA' },
      { data: 'nombreSolicitudA' },
      { data: 'institucionA' },
      { data: 'fechaA' },
      { data: 'etapa' },
      { data: 'tipoA' },
      { data: 'statusA' },
      { data: 'fechaStatusA' },
    ],
    order: [[0, 'desc']],
    createdRow: function (row, data, dataIndex) {
      switch (data.etapa) {
        case 1: data.etapa = 'Formación'; break;
        case 2: data.etapa = 'Capacitación'; break;
      }

      if(data.etapa == 'Formación'){
        switch (data.tipoA) {
          case 1: data.tipoA = 'Diplomado'; break;
          case 2: data.tipoA = 'Acreditación'; break;
          case 3: data.tipoA = 'Planes'; break;
        }
      }else{
        switch (data.tipoA) {
          case 1: data.tipoA = 'Charla'; break;
          case 2: data.tipoA = 'Taller'; break;
        }
      }

      switch (data.statusA) {
        case 0: data.statusA = 'esperando correccion'; break;
        case 1: data.statusA = 'recibido'; break;
        case 2: data.statusA = 'para revisar'; break;
        case 3: data.statusA = 'devuelto por correcciones'; break;
        case 4: data.statusA = 'validado'; break;
        case 5: data.statusA = 'rechazado'; break;
        case 6: data.statusA = 'aprobado'; break;
        case 7: data.statusA = 'aprobado con documento'; break;
      }
    },
    rowCallback: function (row, data) {
      switch (data.etapa) {
        case 'Formación': $('td:eq(4)', row).html('Formación'); break;
        case 'Capacitación': $('td:eq(4)', row).html('Capacitación'); break;
      }
      if(data.etapa == 'Formación'){
        switch (data.tipoA) {
          case 'Diplomado': $('td:eq(5)', row).html('Diplomado'); break;
          case 'Acreditación': $('td:eq(5)', row).html('Acreditación'); break;
          case 'Planes': $('td:eq(5)', row).html('Planes'); break;
        }
      }else{
        switch (data.tipoA) {
          case 'Charla': $('td:eq(5)', row).html('Charla'); break;
          case 'Taller': $('td:eq(5)', row).html('Taller'); break;
        }
      }
      switch (data.statusA) {
        case 'esperando correccion': $('td:eq(6)', row).html('esperando correccion'); break;
        case 'recibido': $('td:eq(6)', row).html('recibido'); break;
        case 'para revisar': $('td:eq(6)', row).html('para revisar'); break;
        case 'devuelto por correcciones': $('td:eq(6)', row).html('devuelto por correcciones'); break;
        case 'validado': $('td:eq(6)', row).html('validado'); break;
        case 'rechazado': $('td:eq(6)', row).html('rechazado'); break;
        case 'aprobado': $('td:eq(6)', row).html('aprobado'); break;
        case 'aprobado con documento': $('td:eq(6)', row).html('aprobado con documento'); break;
      }
      //$('td:eq(2)', row).html(data.institucionA.split('\n')[0]);
      $('td:eq(3)', row).html(data.fechaA.split('T')[0]);
      $('td:eq(7)', row).html(new Date(data.fechaStatusA).toLocaleString());
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

        let projectModalAsesoria = "#projectModalAsesoria";
        $(projectModalAsesoria).addClass('isloading');
        $(projectModalAsesoria).modal('toggle');
        $(projectModalAsesoria).off('shown.bs.modal').on('shown.bs.modal', function () {

          let fields = {};
          fields.id = document.getElementById('projectModalLabelA');
          fields.fechaSolicitud = document.getElementById('projectModalFechaSolicitudA');
          fields.etapa = document.getElementById('projectModalEtapa');
          fields.tipo = document.getElementById('projectModalTipoA');
          fields.nombre = document.getElementById('projectModalNombreA');
          fields.descripcion = document.getElementById('projectModalDescripcionA');
          fields.status = document.getElementById('projectModalStatusA');
          fields.solicitante = document.getElementById('projectModalSolicitanteA');

          fields.comunidad = document.getElementById('projectModalComunidad');
          fields.beneficiarios = document.getElementById('projectModalBeneficirios');
          fields.fechaA = document.getElementById('projectModalFechaAsesoria');
          fields.lugar = document.getElementById('projectModalLugar');


          //fields.filesHeads = document.getElementById('projectModalFilesHeads');
          fields.files = document.getElementById('tableProjectFilesA');
          fields.pluses = document.getElementById('projectModalPlusesA');
          ////////////////

          fields.id.innerText = 'Solicitud Asesoria ID: ' + rowData.idA;
          fields.fechaSolicitud.innerText = rowData.fechaSolicitudA.split('T')[0];
          fields.fechaStatusA = new Date(rowData.fechaStatusA).toLocaleString();
          fields.descripcion.innerText = rowData.descripcionA;
          fields.fechaStatus = new Date(rowData.fechaStatusA).toLocaleString();
          fields.etapa.innerText = rowData.etapa;
          fields.tipo.innerText = rowData.tipoA;
          fields.nombre.innerText = rowData.nombreSolicitudA;
          //fields.statusP.innerText = rowData.status;
          //fields.fechaP.innerText = (new Date(rowData.fechaSolicitud)) == 'Invalid Date' ? rowData.fechaSolicitud.split('T')[0] : (new Date(rowData.fechaSolicitud)).toLocaleDateString();*/
          fields.solicitante.innerText = rowData.institucionA+' '+rowData.dependenciaA;
          fields.comunidad.innerText = rowData.comunidad;
          fields.beneficiarios.innerText = rowData.cantidadBeneficiarios;
          fields.fechaA.innerText = rowData.fechaA.split('T')[0]+' '+rowData.horaA;
          fields.lugar.innerText = rowData.lugarA;


          $.ajax({
            method: 'get',
            url: '/getDocsFromAsesoria?id=' + rowData.idA,
          }).done(function (res) {
            $(projectModalAsesoria).removeClass('isloading');

            rowData.files = res.data;

            // Para mostrar los documentos del proyecto
            fields.files.innerHTML = files(res);
          });

          let plusesHtml = '';
          // PAra mostrar el select de estatus si aun no está aprobado ASESORIA
          fields.pluses.innerHTML = pluses(rowData.idA,rowData.tipoA,rowData.statusA,rowData.notaA,'/asesoriaUpdate');
        });
      });
      //////////////////////////////////////////////////////////////////////////////
      let tablaI = $('#dataTableInvestigacion').DataTable({
        ajax: '/getInvestigacion',
        columns: [
          { data: 'idI' },
          { data: 'nombreSolicitudI' },
          { data: 'institucionI'},
          { data: 'solicitudI' },
          { data: 'tipoI' },
          { data: 'statusI' },
          { data: 'fechaStatusI' },
        ],
        order: [[0, 'desc']],
        createdRow: function (row, data, dataIndex) {
          switch (data.solicitudI) {
            case 1: data.solicitudI = 'Diagnostico'; break;
            case 2: data.solicitudI = 'Diseño'; break;
            case 3: data.solicitudI = 'Ejecusión'; break;
            case 4: data.solicitudI = 'Evaluación'; break;
          }
          switch (data.tipoI) {
            case 1: data.tipoI = 'Carrera'; break;
            case 2: data.tipoI = 'Programa de Postgrado'; break;
            case 3: data.tipoI = 'Programa de Formación'; break;
          }
          switch (data.statusI) {
            case 0: data.statusI = 'esperando correccion'; break;
            case 1: data.statusI = 'recibido'; break;
            case 2: data.statusI = 'para revisar'; break;
            case 3: data.statusI = 'devuelto por correcciones'; break;
            case 4: data.statusI = 'validado'; break;
            case 5: data.statusI = 'rechazado'; break;
            case 6: data.statusI = 'aprobado'; break;
            case 7: data.statusI = 'aprobado con documento'; break;
          }
        },
        rowCallback: function (row, data) {
          switch (data.solicitudI) {
            case 'Diagnostico': $('td:eq(3)', row).html('Diagnostico'); break;
            case 'Diseño': $('td:eq(3)', row).html('Diseño'); break;
            case 'Ejecusión': $('td:eq(3)', row).html('Ejecusión'); break;
            case 'Evaluación': $('td:eq(3)', row).html('Evaluación'); break;
          }
          switch (data.tipoI) {
            case 'Carrera': $('td:eq(4)', row).html('Carrera'); break;
            case 'Programa de Postgrado': $('td:eq(4)', row).html('Programa de Postgrado'); break;
            case 'Programa de Formación': $('td:eq(4)', row).html('Programa de Formación'); break;
          }
          switch (data.statusI) {
            case 'esperando correccion': $('td:eq(5)', row).html('esperando correccion'); break;
            case 'recibido': $('td:eq(5)', row).html('recibido'); break;
            case 'para revisar': $('td:eq(5)', row).html('para revisar'); break;
            case 'devuelto por correcciones': $('td:eq(5)', row).html('devuelto por correcciones'); break;
            case 'validado': $('td:eq(5)', row).html('validado'); break;
            case 'rechazado': $('td:eq(5)', row).html('rechazado'); break;
            case 'aprobado': $('td:eq(5)', row).html('aprobado'); break;
            case 'aprobado con documento': $('td:eq(5)', row).html('aprobado con documento'); break;
          }
          $('td:eq(1)', row).html(data.nombreSolicitudI.split('\n')[0]);
          $('td:eq(6)', row).html(new Date(data.fechaStatusI).toLocaleString());
        },
      });

      tablaI.on('xhr', function () {
        datasinvestigacion = tablaI.ajax.json().data;
      });

      ///////////mostrar detalles al darle click a una fila investigacion
        $('#dataTableInvestigacion tbody').on('click', 'tr', function () {
          let tr = $(this).closest('tr');
          let tdi = tr.find("i.fa");
          let row = tablaI.row(tr);
          let rowData = row.data();

          let projectModal = "#projectModalInvestigacion";
          $(projectModal).addClass('isloading');
          $(projectModal).modal('toggle');
          $(projectModal).off('shown.bs.modal').on('shown.bs.modal', function () {

            let fields = {};
            fields.idI = document.getElementById('projectModalLabelI');
            fields.fechaI = document.getElementById('projectModalFechaI');
            fields.solicitudI = document.getElementById('projectModalSolicitudI');
            fields.tipoI = document.getElementById('projectModalTipoI');
            fields.nombreI = document.getElementById('projectModalNombreI');
            fields.statusI = document.getElementById('projectModalStatusI');
            fields.solicitanteI = document.getElementById('projectModalSolicitanteI');
            fields.descripcionI = document.getElementById('projectModalDescripcionI');

            //fields.filesHeads = document.getElementById('projectModalFilesHeadsI');
            fields.files = document.getElementById('tableProjectFilesI');
            fields.pluses = document.getElementById('projectModalPlusesI');
            ////////////////

            fields.idI.innerText = 'Solicitud Investigacion ID: ' + rowData.idI;
            fields.fechaI.innerText = rowData.fechaSolicitudI.split('T')[0];
            fields.solicitudI.innerText = rowData.solicitudI;
            fields.tipoI.innerText = rowData.tipoI;
            fields.nombreI.innerText = rowData.nombreSolicitudI;
            //fields.statusP.innerText = rowData.status;
            //fields.fechaP.innerText = (new Date(rowData.fechaSolicitud)) == 'Invalid Date' ? rowData.fechaSolicitud.split('T')[0] : (new Date(rowData.fechaSolicitud)).toLocaleDateString();
            fields.solicitanteI.innerText = rowData.institucionI+' '+rowData.dependenciaI;
            fields.descripcionI.innerText = rowData.descripcionI;



            $.ajax({
              method: 'get',
              url: '/getDocsFromInvestigacion?id=' + rowData.idI,
            }).done(function (res) {
              $(projectModal).removeClass('isloading');

              rowData.files = res.data;

              // Para mostrar los documentos del proyecto
              fields.files.innerHTML = files(res);

            });

            let plusesHtml = '';
            // PAra mostrar el select de estatus si aun no está aprobado INVESTIGACION
            plusesHtml = pluses(rowData.idI,rowData.tipoI,rowData.statusI,rowData.notaI,'/investigacionUpdate');

            // Si está aprobado & no ha subido el aval
            plusesHtml = plusesHtml + cargarAval(rowData.idI,rowData.tipoI,rowData.statusI,rowData.solicitudI,"/subirAvalInvestigacion");


            fields.pluses.innerHTML = plusesHtml;
          });
        });
/////////////////////////////////////////////////////////////////////////////

  let tabla = $('#dataTable').DataTable({
    ajax: '/getSolicitudAval',
    columns: [
      { data: 'id' },
      { data: 'nombreSolicitud' },
      { data: 'institucion'},
      { data: 'solicitud' },
      { data: 'tipo' },
      { data: 'status' },
      { data: 'fechaStatus' },
    ],
    order: [[0, 'desc']],
    createdRow: function (row, data, dataIndex) {
      switch (data.solicitud) {
        case 1: data.solicitud = 'Creacion'; break;
        case 2: data.solicitud = 'Rediseño'; break;
        case 3: data.solicitud = 'Acreditación'; break;
        case 4: data.solicitud = 'Renovación'; break;

      }
      switch (data.tipo) {
        case 1: data.tipo = 'Carrera'; break;
        case 2: data.tipo = 'Programa de postgrado'; break;
        case 3: data.tipo = 'Programa de Formación'; break;
      }
      switch (data.status) {
        case 0: data.status = 'esperando correccion'; break;
        case 1: data.status = 'recibido'; break;
        case 2: data.status = 'para revisar'; break;
        case 3: data.status = 'devuelto por correcciones'; break;
        case 4: data.status = 'validado'; break;
        case 5: data.status = 'rechazado'; break;
        case 6: data.status = 'aprobado'; break;
        case 7: data.status = 'aprobado con documento'; break;
      }
    },
    rowCallback: function (row, data) {
      switch (data.solicitud) {
        case 'Creacion': $('td:eq(3)', row).html('Creacion'); break;
        case 'Rediseño': $('td:eq(3)', row).html('Rediseño'); break;
        case 'Acreditación': $('td:eq(3)', row).html('Acreditación'); break;
        case 'Renovación': $('td:eq(3)', row).html('Renovación'); break;
      }
      switch (data.tipo) {
        case 'Carrera': $('td:eq(4)', row).html('Carrera'); break;
        case 'Programa de postgrado': $('td:eq(4)', row).html('Programa de postgrado'); break;
        case 'Programa de Formación': $('td:eq(4)', row).html('Programa de Formación'); break;
      }
      switch (data.status) {
        case 'esperando correccion': $('td:eq(5)', row).html('esperando correccion'); break;
        case 'recibido': $('td:eq(5)', row).html('recibido'); break;
        case 'para revisar': $('td:eq(5)', row).html('para revisar'); break;
        case 'devuelto por correcciones': $('td:eq(5)', row).html('devuelto por correcciones'); break;
        case 'validado': $('td:eq(5)', row).html('validado'); break;
        case 'rechazado': $('td:eq(5)', row).html('rechazado'); break;
        case 'aprobado': $('td:eq(5)', row).html('aprobado'); break;
        case 'aprobado con documento': $('td:eq(5)', row).html('aprobado con documento'); break;
      }
      $('td:eq(1)', row).html(data.nombreSolicitud.split('\n')[0]);
      $('td:eq(6)', row).html(new Date(data.fechaStatus).toLocaleString());
    },
  });


  tabla.on('xhr', function () {
    dataProyectos = tabla.ajax.json().data;
  });

  //////////////////////////////////////////////////////////////////////////////

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
      fields.fechaP = document.getElementById('projectModalFechaP');
      fields.solicitudP = document.getElementById('projectModalSolicitudP');
      fields.tipoP = document.getElementById('projectModalTipoP');
      fields.nombreP = document.getElementById('projectModalNombre');
      fields.statusP = document.getElementById('projectModalStatusP');
      fields.solicitanteP = document.getElementById('projectModalSolicitanteP');
      fields.disennadorP = document.getElementById('projectModalDisennadorP');
      fields.coordinadorP = document.getElementById('projectModalCoordinadorP');
      fields.descripcionP = document.getElementById('projectModalDescripcionP');
      fields.miembrosP = document.getElementById('projectModalMiembrosP');

      //fields.filesHeads = document.getElementById('projectModalFilesHeads');
      fields.files = document.getElementById('tableProjectFiles');
      fields.pluses = document.getElementById('projectModalPluses');
      ////////////////

      fields.id.innerText = 'Solicitud AVAL ID: ' + rowData.id;
      fields.fechaP.innerText = rowData.fechaSolicitud.split('T')[0];
      fields.solicitudP.innerText = rowData.solicitud;
      fields.tipoP.innerText = rowData.tipo;
      fields.nombreP.innerText = rowData.nombreSolicitud;
      //fields.statusP.innerText = rowData.status;
      /*fields.fechaP.innerText = (new Date(rowData.fecha)) == 'Invalid Date' ? rowData.fecha.split('T')[0] : (new Date(rowData.fecha)).toLocaleDateString();*/
      fields.solicitanteP.innerText = rowData.institucion+' '+rowData.dependencia;
      fields.disennadorP.innerText = rowData.disennador;
      fields.coordinadorP.innerText = rowData.coordinador;
      fields.descripcionP.innerText = rowData.descripcion;
      fields.miembrosP.innerText = rowData.miembros;


      // Para mostrar los documentos del proyecto y pluses

      $.ajax({
        method: 'get',
        url: '/getDocsFromSolicitudAval?id=' + rowData.id,
      }).done(function (res) {
        $('#projectModal').removeClass('isloading');
        rowData.files = res.data;

        //fields.files.innerHTML = htmlFiles;

        // Para mostrar los documentos del proyecto
        fields.files.innerHTML = files(res);



        // Definicion del comportamiento al abrir los diferentes modales
        let avancesModal = $('#avancesModal');
        let participantesModal = $('#participantesModal');

        /*
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
          $('#participantesModalTitle').text(rowData.nombreSolicitud);
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
          $('#avancesModalTitle').text(rowData.nombreSolicitud);
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
        */

        //colorear en rojo la tabla de estatus
        if (status2Num(rowData.status) == 0) $('#projectPluses').addClass('atention');

        $('.custom-file-input').change(function (e) {
          let campoInputFile = document.getElementById('aval' + 'Label');
          campoInputFile.innerText = $('#' + 'aval').val().replace('C:\\fakepath\\', '');

        })
      });// fin ajax proyectos

      // PAra mostrar el select de estatus si aun no está aprobado
      let plusesHtml = '';
      plusesHtml = pluses(rowData.id,rowData.tipo,rowData.status,rowData.nota,'/solicitudAvalUpdate');

      // Si está aprobado & no ha subido el aval
      //if (status2Num(rowData.status) >= 6 && !(filesByTipo.find(x => x[0].tipo == 3)) ) { // Falta modificar para que ingrese aval, no cualquier archivo
      plusesHtml = plusesHtml + cargarAval(rowData.id,rowData.tipo,rowData.status,rowData.nombreSolicitud,"/subirAval");

      fields.pluses.innerHTML = plusesHtml;

    });// fin evento modal

  });// evento click table

  function status2Num(status) {
    switch (status) {
      case 'Nuevo': return 0; break;
      case 'recibido': return 1; break;
      case 'para revisar': return 2; break;
      case 'devuelto por correcciones': return 3; break;
      case 'validado': return 4; break;
      case 'rechazado': return 5; break;
      case 'aprobado': return 6; break;
      case 'aprobado con documento': return 7; break;
    }
  }

  function num2Status(num) {
    switch (num) {
      case 0: return 'nuevo'; break;
      case 1: return 'recibido'; break;
      case 2: return 'en revision'; break;
      case 3: return 'devuelto por correcciones'; break;
      case 4: return 'validado'; break;
      case 5: return 'rechazado'; break;
      case 6: return 'aprobado'; break;
      case 7: return 'aprobado con documento'; break;
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

  function pluses(id, tipo, status, nota, ruta){
    // PAra mostrar el select de estatus si aun no está aprobado
    let selectHtml = `
    <div class="input-group mb-3 descoDetails">
      <div class="input-group-prepend">
        <label class="input-group-text" for="status">Estatus</label>
      </div>
      <select required name="status" class="custom-select" id="status">

        <option value="1" ${status2Num(status) == 1 ? 'selected' : ''}>${num2Status(1)}</option>
        <option value="2" ${status2Num(status) == 2 ? 'selected' : ''}>${num2Status(2)}</option>
        <option value="3" ${status2Num(status) == 3 ? 'selected' : ''}>${num2Status(3)}</option>

        <option value="5" ${status2Num(status) == 5 ? 'selected' : ''}>${num2Status(5)}</option>
        <option value="6" ${status2Num(status) == 6 ? 'selected' : ''}>${num2Status(6)}</option>
      </select>
    </div>
    <input class="btn btn-primary btn-block descoDetails" type="submit" value="Actualizar">`;
    let textStatusHtml = `
    <div class="form-group descoDetails" >
      <div class="form-label-group mx-auto" style="width: fit-content">
        <input value="${status}" id="status" class="form-control text-center" placeholder="Estatus" disabled name="status">
        <label for="status">Estatus</label>
      </div>
    </div>
    <br>`;

    // Para mostrar detalles segun estatus
    let plusesHtml = '';
    plusesHtml =
    `<form method="post" action="${ruta}">
      <input class="d-none" name="id" value="${id}"></id>
      <div class="form-group descoDetails">
        <label for="nota">Nota  para el usuario que subió el proyecto</label>
        <textarea ${status2Num(status) >= 6? 'disabled' : ''} class="form-control descoDetails" id="nota" name="nota">${nota ? nota : ''}</textarea>
      </div>
      <br>
      ${status2Num(status) >= 6? textStatusHtml : selectHtml}
    </form>`;

    return plusesHtml;
  } //fin function pluses()
  function cargarAval(id,tipo,status,nombreSolicitud,ruta){
    let plusesHtml = '';
    if (status2Num(status) == 6 ) { // Falta modificar para que ingrese aval, no cualquier archivo
      plusesHtml = plusesHtml +
        `<span>Subir oficio de aval.</span>
        <form method="post" action="${ruta}" enctype="multipart/form-data">
      <input class="d-none" type="text" name="nombreSolicitud" value="${nombreSolicitud}"/>
      <input class="d-none" name="tipo" value="${tipo2Num(tipo)}"/>
      <input class="d-none" name="refProyecto" value="${id}"/>`;
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
    return plusesHtml;
  }

    function files(res){
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


      //fields.filesHeads.innerHTML = cabeceraHtml;
      cabeceraHtml = `</tr>`+cabeceraHtml+`</tr>`;

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

      //fields.files.innerHTML = htmlFiles;
      htmlFiles = cabeceraHtml+`<tbody`+htmlFiles+`<tbody`;

      return htmlFiles;
  }//fin de ver archivos

});
