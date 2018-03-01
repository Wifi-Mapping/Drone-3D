var infoFiles;

$(document).ready(function(){
  $('input[id="file"]').change(function(e){
    infoFiles = [];

    var selectedFiles = e.target.files;
    Array.prototype.push.apply( infoFiles, selectedFiles );

    for (var i = 0; i < infoFiles.length; i++) {
      var idxDot = infoFiles[i].name.lastIndexOf(".") + 1;
      var extFile = infoFiles[i].name.substr(idxDot, infoFiles[i].length).toLowerCase();
      if (extFile=="png"){

        console.log(i + ': The file "' + infoFiles[i].name +  '" has been selected for MIME test.'); //Consolelog

        var blob = infoFiles[i];
        var fileReader = new FileReader();
        fileReader.onloadend = function(e) {
          var arr = (new Uint8Array(e.target.result)).subarray(0, 4);
          var header = "";
          for(var d = 0; d < arr.length; d++) {
             header += arr[d].toString(16);
          }

          var imageByteLength = this.result.byteLength;
          if (header != "89504e47"){
            infoFiles = infoFiles.filter(function(itm){
              return itm.size !== imageByteLength;
            });
            delete infoFiles[i];
          }
        };
        fileReader.readAsArrayBuffer(blob);

      }else{
        console.log(i + ": Only valid PNG files are allowed!"); //Consolelog
        delete infoFiles[i];
      }
    }

    infoFiles.sort();

  });
});

function uploadFile() {
  for (var i = 0; i < infoFiles.length; i++) {
    var storageRef = firebase.storage().ref('/testImages/' + infoFiles[i].name);
    var uploadTask = storageRef.put(infoFiles[i]);
    console.log('The file "' + infoFiles[i].name +  '" has been uploaded.'); //Consolelog
  }
}