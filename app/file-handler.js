var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var mongoose = require('mongoose');
var mongo = require('mongodb');
var grid = require('gridfs-stream');
var gridfs = require('gridfs')
var util = require('util');
var configDB = require('../config/database');
var User = require('../app/models/user');
var File = require('../app/models/file');

module.exports = {
   'upload': function(req, res){
         var form = new formidable.IncomingForm();
			form.uploadDir = __dirname + "/uploads";
         form.multiples = true;
			form.keepExtensions = true;
		 form.parse(req, function(err, fields, files) {
		  if (!err) {
			 grid.mongo = mongoose.mongo;
				 var conn = mongoose.createConnection(configDB.url);
				 conn.once('open', function () {
				 var gfs = grid(conn.db);
				 var writestream = gfs.createWriteStream({
					  filename: files.file.name
				 });
				 fs.createReadStream(files.file.path).pipe(writestream);
             User.findByIdAndUpdate(req.user._id,
                   {
                      $push:{"files": {
                             'id':writestream.id,
                             'name': files.file.name
                          }}
                   },
                   {
                     safe: true,
                     upsert: true,
                   },
                     function(err, model){
                        console.log(err);
                   }
               );

			 });
		  }
		});
		form.on('end', function() {
			 res.send('Completed ..... go and check fs.files & fs.chunks in  mongodb');
		});
   },
   'download': function(req, res){
         mongo.MongoClient.connect(configDB.url, function (err, db) {
         if(err)
         {
            return console.dir(err);
         }
         var fileId = mongoose.Types.ObjectId("5906fa0d81aac1ef141ac433");
         var gridStore = new mongo.GridStore(db, fileId, 'r');
            gridStore.open(function(err, gridStore){
               if(err){
                  res.writeHead(500)
                  return res.end();
               }
                  res.writeHead(200, {'Conent-Type': 'application/pdfg'});
                  gridStore.stream(true).on('end', function(){
                     db.close();
                  }).pipe(res);
         });
      /*
         gridfs = grid(db, mongo);

          // write file
          var writeStream = gridfs.createWriteStream({ filename: req.filenme });
          fs.createReadStream(req.filename).pipe(writeStream);

          // after the write is finished
          writeStream.on("close", function () {
              // read file, buffering data as we go
              readStream = gridfs.createReadStream({ filename: req.filename });

              readStream.on("data", function (chunk) {
                  buffer += chunk;
              });

              // dump contents to console when complete
              readStream.on("end", function () {
                  console.log("contents of file:\n\n", buffer);
              });
          });
          */
      });
   }
}
