$(document).ready(function(){
  var url = document.URL;
  var id = url.substring(url.lastIndexOf('=') + 1);

  $('#myForm').addClass('isloading');
  $.ajax({
    method: 'get',
    url: '/getAsesoriaCorregir?id=' + id,
  }).done(function (res) {
    $('#myForm').removeClass('isloading');
      let datos = res.data[0];
      //alert("fecha"+datos.fechaA.split('T')[0]);
      alert("*Por favor, corrija los datos y re-envielos*");

      $("#id").val(id);
      $("#etapa").val(datos.etapa);
      $("#tipo").val(datos.tipoA);
      $("#titulo").val(datos.nombreSolicitudA);
      $("#descripcion").val(datos.descripcionA);
      $("#institucion").val(datos.institucionA);
      $("#dependencia").val(datos.dependenciaA);
      if(datos.nacionalidad != "V" && datos.nacionalidad != "E"){
        $("#apellidoSolicitante").val(datos.apellidoSolicitanteA);
        $("#nombreSolicitante").val(datos.nombreSolicitanteA);
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
      $("#comunidad").val(datos.comunidad);
      $("#cantidad").val(datos.cantidadBeneficiarios);
      $("#lugar").val(datos.lugarA);
      $("#fechaAsesoria").val(datos.fechaA.split('T')[0]);
      $("#horaAsesoria").val(datos.horaA);
  });
});
