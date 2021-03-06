$(document).ready(function() {

  $('.fecha').text((new Date().toLocaleString()));

  let dataProyectos = [];
  let datasesorias = [];
  let datainvestigacion = [];
  let user;

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

      let projectModal = "#projectModalAsesoria";
      $(projectModal).addClass('isloading');
      $(projectModal).modal('toggle');
      $(projectModal).off('shown.bs.modal').on('shown.bs.modal', function () {

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
          $(projectModal).removeClass('isloading');

          rowData.files = res.data;

        // Para mostrar los documentos del proyecto
          fields.files.innerHTML = files(res);
        });
        // Para mostrar detalles segun estatus
          let plusesHtml = '';
          plusesHtml = `<br>
          <table id="projectPlusesA" class="table-bordered"
          cellpadding="5" cellspacing="0" border="0"
          style="padding-left:50px; margin:auto;">
          <tr>
            <td ROWSPAN="2">Estatus:</td>
            <td>${rowData.statusA}</td>
          </tr>
          <tr>
            <td>${fields.fechaStatusA}</td>
          </tr>
          <tr>
            <td>Nota:</td>
            <td>${rowData.notaA ? rowData.notaA:''}</td>
          </tr>
          </table>
          <br>`;

          if(status2Num(rowData.statusA) == 1 || status2Num(rowData.statusA) == 3) {

            plusesHtml = plusesHtml +
            `<form method="get" action="/enviarAsesoriaCorregido">
            <input type="hidden" id="id" name="id" value="${rowData.idA}"/>
            <input class="btn btn-primary mx-auto d-block" type="submit" value="Corregir datos">
            </form>`;
          }

          fields.pluses.innerHTML = plusesHtml;
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
          fields.fechaStatusI = document.getElementById('projectModalFechaStatusI');
          fields.solicitanteI = document.getElementById('projectModalSolicitanteI');
          fields.descripcionI = document.getElementById('projectModalDescripcionI');

          /*fields.filesHeads = document.getElementById('projectModalFilesHeads');*/
          fields.files = document.getElementById('tableProjectFilesI');
          fields.pluses = document.getElementById('projectModalPlusesI');
          ////////////////

          fields.idI.innerText = 'Solicitud Investigacion ID: ' + rowData.idI;
          fields.fechaI.innerText = rowData.fechaSolicitudI.split('T')[0];
          fields.fechaStatusI = new Date(rowData.fechaStatusI).toLocaleString();
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

          // Para mostrar detalles segun estatus
            let plusesHtml = '';
            plusesHtml = `<br>
            <table id="projectPlusesI" class="table-bordered"
            cellpadding="5" cellspacing="0" border="0"
            style="padding-left:50px; margin:auto;">
            <tr>
              <td ROWSPAN="2">Estatus:</td>
              <td>${rowData.statusI}</td>
            </tr>
            <tr>
              <td>${fields.fechaStatusI}</td>
            </tr>
            <tr>
              <td>Nota:</td>
              <td>${rowData.notaI ? rowData.notaI:''}</td>
            </tr>
            </table>
            <br>`;

            if(status2Num(rowData.statusI) == 1 || status2Num(rowData.statusI) == 3) {
              plusesHtml = plusesHtml +
              `<form method="get" action="/enviarInvestigacionCorregido">
              <input type="hidden" id="id" name="id" value="${rowData.idI}"/>
              <input class="btn btn-primary mx-auto d-block" type="submit" value="Corregir datos">
              </form>`;
            }
            fields.pluses.innerHTML = plusesHtml;
        });
      });

  //////////////////////////////////////////////////////////////////////////////

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
        case 2: data.tipo = 'Programa de Postgrado'; break;
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
        case 'Programa de Postgrado': $('td:eq(4)', row).html('Programa de Postgrado'); break;
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
      fields.descripcionP = document.getElementById('projectModalDescripcionP');
      fields.statusP = document.getElementById('projectModalStatusP');
      fields.solicitanteP = document.getElementById('projectModalSolicitanteP');
      fields.disennadorP = document.getElementById('projectModalDisennadorP');
      fields.coordinadorP = document.getElementById('projectModalCoordinadorP');
      fields.miembrosP = document.getElementById('projectModalMiembrosP');


      fields.filesHeads = document.getElementById('projectModalFilesHeads');
      fields.files = document.getElementById('tableProjectFiles');
      fields.pluses = document.getElementById('projectModalPluses');
      ////////////////

      fields.id.innerText = 'Solicitud AVAL ID: ' + rowData.id;
      fields.fechaP.innerText = rowData.fechaSolicitud.split('T')[0];
      fields.fechaStatusP = new Date(rowData.fechaStatus).toLocaleString();
      fields.solicitudP.innerText = rowData.solicitud;
      fields.tipoP.innerText = rowData.tipo;
      fields.nombreP.innerText = rowData.nombreSolicitud;
      //fields.statusP.innerText = rowData.status;
      //fields.fechaP.innerText = (new Date(rowData.fechaSolicitud)) == 'Invalid Date' ? rowData.fechaSolicitud.split('T')[0] : (new Date(rowData.fechaSolicitud)).toLocaleDateString();*/
      fields.solicitanteP.innerText = rowData.institucion+' '+rowData.dependencia;
      fields.disennadorP.innerText = rowData.disennador;
      fields.coordinadorP.innerText = rowData.coordinador;
      fields.miembrosP.innerText = rowData.miembros;
      fields.descripcionP.innerText = rowData.descripcion;

      // Para mostrar los documentos del proyecto
      $.ajax({
        method: 'get',
        url: '/getDocsFromSolicitudAval?id=' + rowData.id,
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
        //Fin mostrar archivos


        // Si esta aprobado
        /*
        if(status2Num(rowData.status) >= 6) {
          fields.pluses.innerHTML = fields.pluses.innerHTML +
          `<div class="text-right text-white">
            <a id="showParticipantes" class="btn btn-info 2ndModal" ${status2Num(rowData.status) == 6 ? 'style="float: left; margin-right: 5px;"' : ''}>Ver participantes</a>
            <a id="showAvances" class="btn btn-info 2ndModal" ${status2Num(rowData.status) == 6 ? 'style="float: left; margin-right: 5px;"' : ''}>Ver avances</a>
            ${status2Num(rowData.status) == 6 ? '<a id="addAvances" class="btn btn-primary 2ndModal">Añadir avances</a>' : ''}
            ${status2Num(rowData.status) == 6 ? '<a id="addParticipantes" class="btn btn-primary 2ndModal">Añadir participantes</a>' : ''}
          </div>`;
          if (status2Num(rowData.status) == 6  && rowData.avances > 0) {
            fields.pluses.innerHTML = fields.pluses.innerHTML +
            `<div class="text-right text-white mt-5">
              <a id="finalizarProyecto" class="btn btn-danger 2ndModal">Finalizar proyecto</a>
            </div>`;
          }

          $('.2ndModal').on('click', function(ev) {
            ev.preventDefault();
            let altura = document.getElementById('projectModal').scrollTop;
            let projectModal = $('#projectModal');
            let targetModal;
            switch(this.innerText){
              case 'Ver participantes': targetModal = $('#participantesModal'); break;
              case 'Ver avances': targetModal = $('#avancesModal'); break;
              case 'Añadir avances': targetModal = $('#addAvancesModal'); break;
              case 'Añadir participantes': targetModal = $('#addParticipantesModal'); break;
              case 'Finalizar proyecto': targetModal = $('#finalizarProyectoModal'); break;
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
          }); // fin evento click botones de modales
        }*/ // fin if(aprobado)

        // Definicion del comportamiento al abrir los diferentes modales
        let addAvancesModal = $('#addAvancesModal');
        let addParticipantesModal = $('#addParticipantesModal');
        let avancesModal = $('#avancesModal');
        let finalizarModal = $('#finalizarProyectoModal');
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
            for (let i = 0; i < res.data.length; i++) {
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

        addParticipantesModal.off('show.bs.modal').on('show.bs.modal', function() {
          document.getElementById('addParticipantesRefProyecto').value = rowData.id;
           // cuando cambia el tipo de participante al agregar participante
          $('#tipoParticipante').off('change').on('change', function() {
            let lugarComunidadHtml = `
            <div id="placeholderLugar">
              <div class="form-group">
                <div class="form-label-group">
                  <input type="text" id="lugar" class="form-control" placeholder="Facultad o ubicación" required autofocus name="lugar">
                  <label for="lugar">Facultad o ubicación</label>
                </div>
              </div>
            </div>
            `;
            let lugarUcHtml = `
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <label class="input-group-text" for="lugar">Facultad</label>
              </div>
              <select required name="lugar" class="custom-select" id="lugar">
              <option value='' selected disabled>Escoge...</option>
              <option value="FCJP">Ciencias Jurídicas y Políticas (FCJP)</option>
              <option value="FCS">Ciencias de la Salud (FCS)</option>
              <option value="FaCES">Ciencias Económicas y Sociales (FaCES)</option>
              <option value="FaCE">Ciencias de la Educación (FaCE)</option>
              <option value="FaCyT">Experimental de Ciencia y Tecnología (FaCyT)</option>
              <option value="Ingenieria">Ingeniería</option>
              <option value="Odontologia">Odontología</option>
              </select>
            </div>
            `;
            if(this.value == 3) {
              $('#placeholderLugar').html(lugarComunidadHtml);
            } else {
              $('#placeholderLugar').html(lugarUcHtml);
            }
          });
          $('#addParticipantesModalTitle').text(rowData.nombreProyecto);
        })

        addAvancesModal.off('show.bs.modal').on('show.bs.modal', function() {
          $('#addAvancesModalTitle').text(rowData.nombreProyecto);
        })

        finalizarModal.off('show.bs.modal').on('show.bs.modal', function() {
          $('#finalizarProyectoTitle').text(rowData.nombreProyecto);
          //let finalizarHtml = '';
          let div = document.getElementById('finalizarProyecto');
          div.value = rowData.id;
        })
        //colorear en la tabla de estatus
        if(status2Num(rowData.status) == 0 || status2Num(rowData.status) == 3 || status2Num(rowData.status) == 5){
          $('#projectPluses').addClass('atention');
        } else {
          $('#projectPluses').addClass('no-prob');
        }
        //Si se cambia el archivo al estar en el estatus "esperando correccion"
        $('.custom-file-input').change(function(e) {
          let campoInputFile = document.getElementById(this.id + 'Label');
          if (campoInputFile) campoInputFile.innerText = $('#' + this.id).val().replace('C:\\fakepath\\','');
        })

      });// fin ajax proyectos

      // Para mostrar detalles segun estatus
      let plusesHtml = '';
      plusesHtml = `<br>
      <table id="projectPluses" class="table-bordered"
      cellpadding="5" cellspacing="0" border="0"
      style="padding-left:50px; margin:auto;">
      <tr>
        <td ROWSPAN="2">Estatus:</td>
        <td>${rowData.status}</td>
      </tr>
      <tr>
        <td>${fields.fechaStatusP}</td>
      </tr>
      <tr>
        <td>Nota:</td>
        <td>${rowData.nota ? rowData.nota:''}</td>
      </tr>
      </table>
      <br>`;

      // Si es para revisar v
      if(status2Num(rowData.status) == 0) {
        plusesHtml = plusesHtml +
        `<form method="post" action="/actualizarDocs" enctype="multipart/form-data">
        <input class="d-none" type="text" name="nombreSolicitud" value="${rowData.nombreSolicitud}"/>
        <input class="d-none" name="tipo" value="${tipo2Num(rowData.tipo)}"/>
        <input class="d-none" name="refProyecto" value="${rowData.id}"/>`;
        for(let i = 0; i < maxNumero; i++){
          plusesHtml = plusesHtml +
          `<div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text">Archivo ${i+1}</span>
          </div>
          <div class="custom-file">
            <input type="file" class="custom-file-input" name="inputFile${i+1}" id="inputFile${i+1}" accept=".pdf, .doc, .docx, .xlsx">
            <label id="inputFile${i+1}Label" class="custom-file-label" for="inputFile${i+1}">Escoger Archivo PDF, Word, Excel</label>
          </div>
        </div>`
        }
        plusesHtml = plusesHtml +
        `<input class="btn btn-primary mx-auto d-block" type="submit" value="Actualizar">
        </form>`;
      }

      if(status2Num(rowData.status) == 1 || status2Num(rowData.status) == 3) {

        plusesHtml = plusesHtml +
        `<form method="get" action="/enviarSolicitudAvalCorregido">
        <input type="hidden" id="id" name="id" value="${rowData.id}"/>
        <input class="btn btn-primary mx-auto d-block" type="submit" value="Corregir datos">
        </form>`;
      }

      fields.pluses.innerHTML = plusesHtml;

    });// fin evento shown modal proyecto

  });//fin evento click table


  // Empieza tratamiento de formulario de fecha
  let currDate = new Date();
  let months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ]

  // Set años
  for(let i = currDate.getFullYear() - 10; i <= currDate.getFullYear(); i++) {
    let opt = document.createElement('option');

    opt.value = i;
    opt.text = i;
    if (i == currDate.getFullYear()) {
      opt.setAttribute('selected','selected');
    }
    document.getElementById('anoInicio').appendChild(opt);

  }

  // Set meses
  for (let i = 0; i < 12; i++){
    let opt = document.createElement('option');
    opt.value = i + 1;
    opt.text = months[i];
    document.getElementById('mesInicio').appendChild(opt);
  }

  //Set dias inicio
  $('#mesInicio').change( function() {
    let diasSelect = document.getElementById('diaInicio');
    diasSelect.innerHTML = '';
    for(let i = 0; i < diasEn(this.value); i++) {
      let opt = document.createElement('option');
      opt.value = i + 1;
      opt.text = i + 1;
      document.getElementById('diaInicio').appendChild(opt);
    }
  })



  function diasEn(mes) {
    switch(Number(mes)){
      case 1: case 3: case 5: case 7: case 8: case 10: case 12:
        return 31;
      case 4: case 6: case 9: case 11:
        return 30;
      case 2: return 28;
    }
  }

  function status2Num(status) {
    switch(status) {
      case 'esperando correccion': return 0; break;
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
    switch(num) {
      case 0: return 'esperando correccion'; break;
      case 1: return 'recibido'; break;
      case 2: return 'para revisar'; break;
      case 3: return 'devuelto por correcciones'; break;
      case 4: return 'validado'; break;
      case 5: return 'rechazado'; break;
      case 6: return 'aprobado'; break;
      case 7: return 'aprobado con documento'; break;
    }
  }

  function solicitud2Num(tipo) {
    switch(tipo) {
      case 'Creacion': return 1; break;
      case 'Rediseño': return 2; break;
    }
  }

  function tipo2Num(tipo) {
    switch(tipo) {
      case 'Carrera': return 1; break;
      case 'Diplomado': return 2; break;
      case 'Programa de Formación': return 3; break;
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

  function dformat(d){
      let dformat = [d.getFullYear(),
                (d.getMonth()+1).padLeft(),
                 d.getDate().padLeft()].join('-') +' ' +
                [d.getHours().padLeft(),
                 d.getMinutes().padLeft(),
                 d.getSeconds().padLeft()].join(':');
    return dformat;
  }

  $('textarea').each(function () {
    this.setAttribute('style', 'height:60px;overflow-y:hidden;');
  }).on('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
  });

  $('#inputFile').change(function(e) {
    let campoInputFile = document.getElementsByClassName('custom-file-label')[0];
    if(document.getElementById('inputFile').files.length > 1) {
      campoInputFile.innerText = `${document.getElementById('inputFile').files.length} archivos seleccionados.`
    } else {
      campoInputFile.innerText = $('#inputFile').val().replace('C:\\fakepath\\','');
    }

  })

  function files(res){//ver archivos
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
