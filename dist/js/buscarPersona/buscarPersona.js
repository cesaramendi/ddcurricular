$(document).ready(function() {
  $('#buscarPersona').click(function () {
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
  });

  buscarPersonaYllenarInput('#buscarCoordinador','#coordinador','#coordinadorNAC','#coordinadorCI');

  buscarPersonaYllenarInput('#buscarDisennador','#disennador','#disennadorNAC','#disennadorCI');

  buscarPersonaYllenarInput('#buscarMiembro','#miembros','#miembrosNAC','#miembrosCI');


  function buscarPersonaYllenarInput(idBoton,idInput,nacionalidad,cedula){
    $(idBoton).click(function () {

      var data = $(nacionalidad).serialize()+'&'+$(cedula).serialize()
      //alert('Datos serializados: '+data);

      $.ajax({
          type: "get",
          url: "/buscarPersona?"+data,
          //data: data,
      }).done(function (res) {
        let datos = res.data[0];
          //si encuentra apellido llena el campo
          $(idInput).val($(idInput).val()+', '+datos.apellido+' '+datos.nombre);
        });
    });

  }

});
