module.exports = {
   'upload': function(req, res){
         var path = require('path');
         var formidable = require('formidable')

         var form = new formidable.IncomingForm();
         form.multiples = true;
         form.uploadDir = path.join(__dirname, '/uploads');

         form.on('fileBegin', function(name, file){
            console.log('file begin');
            file.path = form.uploadDir + '/' + file.name;
         })

         form.on('file', function(field, file){
            console.log('file');
            console.log(field);
            console.log(file);
         });

         form.on('error', function(err){
            console.log(err);
         });

         form.on('end', function(){
            res.end('success')
         });

         form.parse(req);
   }
}
