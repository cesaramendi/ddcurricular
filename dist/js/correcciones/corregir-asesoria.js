$(document).ready(function(){
  var url = document.URL;
  var id = url.substring(url.lastIndexOf('=') + 1).split('#')[0];
  //alert(id);
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

      if(datos.etapa == 1){
        //alert('formacion');
        $("#tipo").append(new Option("Diplomado", "1"));
        $("#tipo").append(new Option("Acreditación", "2"));
        $("#tipo").append(new Option("Planes", "3"));
      }
      if(datos.etapa == 2){
        //alert('capacitacion');
        $("#tipo").append(new Option("Charla", "1"));
        $("#tipo").append(new Option("Taller", "2"));
      }
      $("#tipo").val(datos.tipoA);
      
      $("#nombreSolicitud").val(datos.nombreSolicitudA);
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
      $("#cantidadBeneficiarios").val(datos.cantidadBeneficiarios);
      $("#lugar").val(datos.lugarA);
      $("#fechaAsesoria").val(datos.fechaA.split('T')[0]);
      $("#horaAsesoria").val(datos.horaA);
  });
  //$('#etapa').change(function () {

  //});

});
