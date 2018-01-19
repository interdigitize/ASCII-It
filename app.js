const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const imageToAscii = require('image-to-ascii');
var fs = require('fs');
var gm = require('gm').subClass({ imageMagick: true });
var multer = require('multer');
const AWS = require('aws-sdk');
const PORT = process.env.PORT || 3000;

AWS.config.update({ region: 'us-west-1' });
AWS.config.update({
  accessKeyId:
    process.env.ACCESS_KEY_ID || require('./config.json').ACCESS_KEY_ID,
  secretAccessKey:
    process.env.SECRET_ACCESS_KEY || require('./config.json').SECRET_ACCESS_KEY
});

s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const app = express();

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, 'client/build')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(multer().any());

app.post('/photo', function(req, res, next) {
  var mimetype = req.files[0].mimetype;
  var filename = req.files[0].originalname;
  // var key = Date.now().toString() + '_' + filename;
  var region = 'us-west-1';
  var bucket = 'ascii-it';
  var uploadParams = {
    ACL: 'public-read',
    Bucket: bucket,
    // Key: key,
    // Body: req.files[0].buffer,
    ContentType: req.files[0].mimetype
  };
  if (!fs.existsSync(`${__dirname}/ascii/`)) {
    fs.mkdirSync(`${__dirname}/ascii/`);
  }

  let file = `${__dirname}/ascii/ascii-${filename}`;
  console.log('buffer file', req.files[0].buffer);
  imageToAscii(req.files[0].buffer, { colored: false }, (err, converted) => {
    if (err) {
      console.log('conversion error', err);
      return;
    }
    console.log(converted);

    gm(500, 500, 'white')
      .drawText(5, 5, converted)
      .write(`${__dirname}/ascii/ascii-${filename}`, function(err) {
        if (err) {
          console.log('saving to a jpg  error', err);
          return;
        }
        // call S3 to retrieve upload file to specified bucket
        var fileStream = fs.createReadStream(file);
        fileStream.on('error', function(err) {
          console.log('File Error', err);
        });
        uploadParams.Body = fileStream;
        uploadParams.Key = Date.now().toString() + '_ascii-' + filename;
        console.log(uploadParams.Key);

        //call S3 to retrieve upload file to specified bucket
        s3.upload(uploadParams, function(err, data) {
          if (err) {
            console.log('Error', err);
          }
          if (data) {
            var options = {
              root: __dirname + '/ascii/',
              dotfiles: 'deny',
              headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
              }
            };
            console.log('Upload Success', data.Location);
            res.send(
              `https://s3-us-west-1.amazonaws.com/ascii-it/${uploadParams.Key}`,
              options,
              function(err) {
                if (err) {
                  next(err);
                  console.log(err);
                } else {
                  console.log('Sent', `ascii-${filename}`);
                }
              }
            );
            fs.unlink(file, function(err) {
              if (err) throw err;
              console.log('file deleted!');
            });
          }
        });
      });
  });
  // })
  // .catch(err => {
  //   console.log('catch err', err);
  //   res.send('error');
  // });
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, function() {
  console.log(`Listening on port ${PORT}`);
});
