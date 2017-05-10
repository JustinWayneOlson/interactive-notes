var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var mongoose = require('mongoose');
var mongo = require('mongodb');
var gridstream = require('gridfs-stream');
var gridfs = require('gridfs')
var util = require('util');
var configDB = require('../config/database');
var User = require('../app/models/user');

module.exports = {
   'upload': function(req, res){
      var form = new formidable.IncomingForm();
      form.uploadDir = __dirname + "/uploads";
      form.multiples = true;
      form.keepExtensions = true;
		form.parse(req, function(err, fields, files) {
		   if (!err) {
            if(!files.file.name || !files.file.name.match(/\.pdf$/i))
            {
               res.status(500).send({error: 'INVALID_FILETYPE'});
            }
            else
            {
                gridstream.mongo = mongoose.mongo;
                var conn = mongoose.createConnection(configDB.url);
                conn.once('open', function () {
                   var gfs = gridstream(conn.db);
                   console.log("file name");
                   console.log(files.file.name);
                   var writestream = gfs.createWriteStream({
                       filename: files.file.name,
                       mode: 'w',
                       metadata: req.body
                   });
                   fs.createReadStream(files.file.path).pipe(writestream);
                   console.log(files.file);
                   writestream.on('close', function(file){
                       User.findById(req.user._id, function(err, user){
                           user.files.push({
                              "file_id": file._id,
                              "upload_date" : new Date().toISOString().replace(/T/, ' ').replace(/\..+/,''),
                              "name": files.file.name});
                           user.save(function(err, updatedUser){
                              return res.json(200, {"response": "success"});
                           });
                        });

                      res.send('Success');
                      fs.unlink(files.file.path, function(err){
                         if(err)
                         {
                            console.log(err);
                         }
                         else{
                            console.log("unlinked");
                         }
                      });
                   });

                 });

            }
        }
		});
   },
   'download': function(req, res){
       gridstream.mongo = mongoose.mongo;
       var conn = mongoose.createConnection(configDB.url);
       conn.once('open', function() {
          var gfs = gridstream(conn.db);
          var readstream = gfs.createReadStream({
            _id: req.params.id
          });
          readstream.pipe(res);
       });
   },
   'delete_file': function(req, res){
       gridstream.mongo = mongoose.mongo;
       var conn = mongoose.createConnection(configDB.url);
       conn.once('open', function() {
          var gfs = gridstream(conn.db);
          gfs.remove({_id: req.params.id}, function(err, result){
            if(err)
            {
               console.log(err);
            }
            else
            {
              User.findById(req.user.id, function(err, user){
                  for(var i=0; i< user.files.length; i++)
                  {
                     if(user.files[i].file_id && user.files[i].file_id == req.params.id)
                     {
                        user.files.splice(i,1);
                        break;
                     }
                  }
                  user.save(function(err, updatedUser){
                     return res.json(200, updatedUser)
                  });
               });
            }
          });
       });
   }
}
