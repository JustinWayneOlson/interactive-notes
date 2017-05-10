$(document).ready(function(){
	$('.upload-btn').on('click', function (){
		 $('#upload-input').click();
		 $('.progress-bar').text('0%');
		 $('.progress-bar').width('0%');
	});

   $('.delete-button').on('click', function(){
      $.ajax({
         url: '/delete/' + $(this).attr('data-file-id'),
         type: 'GET',
         success: function(data){
            location.reload();
         },
         error: function(error){
            console.log(error);
         }
      });
   });

   $('#upload-modal-button').on('click', function(){
      $('#upload-modal').modal();
   });

	$('#upload-input').on('change', function(){

	  var files = $(this).get(0).files;

	  if (files.length > 0){
		 var uploadFile = new FormData();

		 for (var i = 0; i < files.length; i++) {
			var file = files[i];

			uploadFile.append('file', file, file.name);
		 }
		 $.ajax({
			url: '/upload',
			type: 'POST',
			data: uploadFile,
			processData: false,
			contentType: false,
			success: function(data){
            location.reload();
			},
         error: function(error){
            console.log(error);
            if(error.responseJSON.error == "INVALID_FILETYPE")
            {
               alert("Currently only .pdf files are supported. Please upload a .pdf file instead");
            }
         },
			xhr: function() {
			  var xhr = new XMLHttpRequest();

			  xhr.upload.addEventListener('progress', function(evt) {

				 if (evt.lengthComputable) {
					var percentComplete = evt.loaded / evt.total;
					percentComplete = parseInt(percentComplete * 100);
					$('.progress-bar').text(percentComplete + '%');
					$('.progress-bar').width(percentComplete + '%');
					if (percentComplete === 100) {
					  $('.progress-bar').html('Done');
					}
				 }
			  }, false);
			  return xhr;
			}
		 });
	  }
	});
});
