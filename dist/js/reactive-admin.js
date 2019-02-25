$(document).ready(function() {
  $('.fecha').text((new Date().toLocaleString()));
  let dataUsers = []
  let user;
  let tablaP = $('#dataTablePersonas').DataTable({
    ajax: '/getPersonas',
    columns: [
    { data: 'nacionalidad' },
    { data: 'cedula' },
    { data: 'nombre' },
    { data: 'apellido' },
    ],
  });

  tablaP.on( 'xhr', function () {
    dataUsers = tablaP.ajax.json().data;
  });

  $('#dataTablePersonas tbody').on('click', 'tr', function () {
    let tr = $(this).closest('tr');
    let tdi = tr.find("i.fa");
    let row = tablaA.row(tr);
    let rowData = row.data();

    let projectModalAsesoria = "#projectModalAsesoria";
    $(projectModalAsesoria).addClass('isloading');
    $(projectModalAsesoria).modal('toggle');
    $(projectModalAsesoria).off('shown.bs.modal').on('shown.bs.modal', function () {

      let fields = {};
      fields.nacionalidad = document.getElementById('projectModalLabelA');
      fields.cedula = document.getElementById('projectModalTitulo');
      fields.nombre = document.getElementById('projectModalTipoA');
      fields.apellido = document.getElementById('projectModalStatusA');

      ///////////////

      fields.nacionalidad.innerText = rowData.nacionalidad;
      fields.cedula.innerText = rowData.cedula;
      fields.nombre.innerText = rowData.nombre;
      fields.apellido.innerText = rowData.apellido;
    });
  });

  //////////////////////////////////////////////////////////////////////////////
  let tabla = $('#dataTable').DataTable({
    ajax: '/getUsers',
    columns: [
    { data: 'email' },
    { data: 'rol' },
    { data: 'facultad' },
    ],
    createdRow: function(row, data, dataIndex) {
      //dataUsers.push(data);
      if (data.rol == 1) {
        data.rol = 'Administrador';
      } else if (data.rol == 2) {
        data.rol = 'DESCO';
      } else if (data.rol == 3) {
        data.rol = 'Facultad';
      }
    },
    rowCallback: function(row, data) {
      if (data.rol == 'Administrador'){
        $('td:eq(1)', row).html('Administrador');
      } else if (data.rol == 'DESCO'){
        $('td:eq(1)', row).html('Curriculum');
      } else if (data.rol == 'Facultad'){
        $('td:eq(1)', row).html('Usuario');
      }
    },
  });

  tabla.on( 'xhr', function () {
    dataUsers = tabla.ajax.json().data;
  });

  $('#dataTable tbody').on('click', 'tr', function() {
    user = dataUsers.find(x => x.email == $(this)[0].cells[0].innerText);
    $('#inputEmail').val(user.email);
    $('#selectRol').val(rolStr2Num(user.rol));
    rolStr2Num(user.rol) == 1 ? $('#selectRol').prop({disabled:true}) : $('#selectRol').prop({disabled:false});
    rolStr2Num(user.rol) == 3 ? $('#selectFacultad').prop({disabled:false}) : $('#selectFacultad').prop({disabled:true});
    $('#selectFacultad').val(user.facultad);
    $('#editModal').modal();
  });


  $('#editButton').on('click', function(e) {
    e.preventDefault();
    if(($('#inputPassword').val() == $('#confirmPassword').val())) {
      let dataEdit = {
        email: user.email,
        rol: $('#selectRol').val() ? $('#selectRol').val() : rolStr2Num(user.rol),
        facultad: $('#selectFacultad').val(),
        pass: $('#inputPassword').val() ? $('#inputPassword').val() : undefined,
      }
      $.ajax({
        url: '/editUser',
        method: 'POST',
        data: dataEdit,
      }).done(function(res) {
        location.reload();
      }).fail(function(err) {
        $('#errorHolder').html('<b>Ocurrió un error</b>').css('color', 'red');
        console.error(err);
      })
    } else {
      $('#errorHolder').html('<b>Contraseñas no coinciden</b>').css('color','red');
    }

  })

  $('#selectRol').change(function() {
    this.value != 3 ?
    $('#selectFacultad').prop('disabled', true).val('').prop('required', false) :
    $('#selectFacultad').prop('disabled', false).prop('required', true);
  })

  function rolNum2Str(n) {
    return n == 1 ? 'Administrador' : n == 2 ? 'DESCO' : 'Facultad';
  };

  function rolStr2Num(str) {
    return str == 'Administrador' ? 1 : str == 'DESCO' ? 2 : 3;
  }

});
