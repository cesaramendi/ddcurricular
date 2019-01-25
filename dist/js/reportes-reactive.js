(document).ready(function() {

  $('.fecha').text((new Date().toLocaleString()));

  let dataProyectos = [];
  let data2 = []
  let user;

  let tabla2 = $('#dataTableCarrerasCantTipos').DataTable({
    ajax: '/getCarrerasCantTipos',
    columns: [
      { data: 'tipo' },
      { data: 'cant' },
    ],
    order: [[0, 'desc']],
    createdRow: function (row, data, dataIndex) {
      switch (data.tipo) {
        case 1: data.tipo = 'Pregrado'; break;
        case 2: data.tipo = 'Postgrado'; break;
        case 3: data.tipo = 'Diplomado'; break;
      }
    },
    rowCallback: function (row, data) {
      switch (data.tipo) {
        case 'Pregrado': $('td:eq(0)', row).html('Pregrado'); break;
        case 'Postgrado': $('td:eq(0)', row).html('Postgrado'); break;
        case 'Diplomado': $('td:eq(0)', row).html('Diplomado'); break;
      }
    },
  });

  tabla2.on('xhr', function () {
    data2 = tabla2.ajax.json().data;
  });
