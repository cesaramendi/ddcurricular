$(document).ready(function(){
  var url = document.URL;
  var id = url.substring(url.lastIndexOf('=') + 1);

  $('#myForm').addClass('isloading');
  $.ajax({
    method: 'get',
    url: '/getProyectoCorregir?id=' + id,
  }).done(function (res) {
    $('#myForm').removeClass('isloading');
      let datos = res.data[0];
      alert("Por favor, corrija los datos y re-envielos ID:"+id);
      $("#id").val(id);
      $("#solicitud").val(datos.solicitud);
      $("#tipo").val(datos.tipo);
      $("#nombreSolicitud").val(datos.nombreSolicitud);
      $("#introduccion").val(datos.introduccion);
      $("#nacionalidad").val(datos.nacionalidad);
      $("#cedula").val(datos.cedula);
      if(datos.nacionalidad != "V" && datos.nacionalidad != "E"){
        $("#apellidoSolicitante").val(datos.apellidoSolicitante);
        $("#nombreSolicitante").val(datos.nombreSolicitante);
      }else{
        var apellido = '#apellidoSolicitante';
        var nombre = '#nombreSolicitante';

        var data = $('#nacionalidad').serialize()+'&'+$('#cedula').serialize()
        //alert('Datos serializados: '+data);

        //habilitar el campo apellido
        $(apellido).removeAttr("readonly");
        //habilitar el campo nombre
        $(nombre).removeAttr("readonly");
        $.ajax({
            type: "get",
            url: "/buscarPersona?"+data,
            //data: data,
        }).done(function (res) {
          let datos = res.data[0];
            //si encuentra apellido llena el campo
            $(apellido).val(datos.apellido);
            //y deshabilitar el campo
            $(apellido).prop("readonly", true);

            //si encuentra nombre llena el campo
            $(nombre).val(datos.nombre);
            //y deshabilitar el campo
            $(nombre).prop("readonly", true);
          });
      }
      $("#coordinador").val(datos.coordinador);
      $("#disenno").val(datos.disenno);
      $("#participantes").val(datos.participantes);
      $("#descripcion").val(datos.descripcion);
  });
});
