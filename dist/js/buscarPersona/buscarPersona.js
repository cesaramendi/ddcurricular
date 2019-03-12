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

  $('#etapa').change(function () {
    $('#tipo option[value="1"]').remove();
    $('#tipo option[value="2"]').remove();
    $('#tipo option[value="3"]').remove();

    if(($('#etapa').val()) == 1){
      //alert('formacion');
      $("#tipo").append(new Option("Diplomado", "1"));
      $("#tipo").append(new Option("Acreditación", "2"));
      $("#tipo").append(new Option("Planes", "3"));
    }else{
      //alert('capacitacion');
      $("#tipo").append(new Option("Charla", "1"));
      $("#tipo").append(new Option("Taller", "2"));
    }
  });


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
