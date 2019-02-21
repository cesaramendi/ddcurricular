$(document).ready(function() {
  $('#buscarPersona').click(function () {
    var apellido = '#apellidoSolicitanteA';
    var nombre = '#nombreSolicitanteA';

    var data = $('#nacionalidad').serialize()+'&'+$('#cedula').serialize()
    //alert('Datos serializados: '+data);

    //habilitar el campo apellido
    $(apellido).removeAttr("disabled");
    //habilitar el campo nombre
    $(nombre).removeAttr("disabled");
    $.ajax({
        type: "get",
        url: "/buscarPersona?"+data,
        //data: data,
    }).done(function (res) {
      let datos = res.data[0];
        //si encuentra apellido llena el campo
        $(apellido).val(datos.apellido);
        //y deshabilitar el campo
        $(apellido).prop("disabled", true);

        //si encuentra nombre llena el campo
        $(nombre).val(datos.nombre);
        //y deshabilitar el campo
        $(nombre).prop("disabled", true);
      });
  });
});
