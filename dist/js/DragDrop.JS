// getElementById
function $id(id) {
    return document.getElementById(id);
  }

  //
  // output information
  function Output(msg) {
    var m = $id("messages");
    m.innerHTML = msg + m.innerHTML;
  }
  // call initialization file
    if (window.File && window.FileList && window.FileReader) {
      Init();
    }

    //
    // initialize
    function Init() {

      var fileselect = $id("fileselect"),
        filedrag = $id("filedrag"),
        submitbutton = $id("submitbutton");

      // file select
      fileselect.addEventListener("change", FileSelectHandler, false);

      // is XHR2 available?
      var xhr = new XMLHttpRequest();
      if (xhr.upload) {
      
        // file drop
        filedrag.addEventListener("dragover", FileDragHover, false);
        filedrag.addEventListener("dragleave", FileDragHover, false);
        filedrag.addEventListener("drop", FileSelectHandler, false);
        filedrag.style.display = "block";
        
        // remove submit button
        submitbutton.style.display = "none";
      }

    }

    // file drag hover
  function FileDragHover(e) {
    e.stopPropagation();
    e.preventDefault();
    e.target.className = (e.type == "dragover" ? "hover" : "");
  }

  // file selection
  function FileSelectHandler(e) {

  // cancel event and hover styling
  FileDragHover(e);
    console.log("Mi e------->",e)
  // fetch FileList object
  let files = e.target.files || e.dataTransfer.files;
  if(window.files===undefined|| window.files=== null){
    window.files = [];

  }
  // window.files = files;
  console.log("Mis files dropeadas ------>",files)
  // process all File objects
  for (var i = 0, f; f = files[i]; i++) {
    window.files.push(f)
    ParseFile(f);
    // let file = inputFile[0].files[index];
  }
  
  }
  function ParseFile(file) {

    Output(
      "<p>Documento: <strong>" + file.name +
      "</strong> tipo: <strong>" + file.type +
      "</strong> tamaño: <strong>" + file.size +
      "</strong> bytes</p>"
    );

    }

$(function(){
    let inputFile = $('#fileselect');
    let button = $('#filedrag');

    button.click(function() {
      inputFile.click();
    });
    
});



function pressEnviar(){
    console.log("hola", $('#fileselect')[0].files)
    console.log("hola", window)
    console.log("hola", window.File)
    console.log("Mis files al enviar", window.files)
    console.log("Solicitud", $('#solicitud')[0].value);
    
    fetch('/uploadSolicicitudAval', {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      // body: JSON.stringify()
    })
      .then(function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }
        console.log("volvi")
          
      })
      .catch(function(err) {
          console.log("Fetch Error :-S", err);
      });
  }