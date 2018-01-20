const express = require('express');
const path = require('path');
const imageToAscii = require('image-to-ascii');
const gm = require('gm').subClass({ imageMagick: true });
const stream = require('stream');
const multer = require('multer');
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
app.use(multer().any());

// API routes
app.post('/photo', function(req, res, next) {
  var mimetype = req.files[0].mimetype;
  var filename = req.files[0].originalname;
  var region = 'us-west-1';
  var uploadParams = {
    ACL: 'public-read',
    Bucket: 'ascii-it',
    ContentType: req.files[0].mimetype
  };

  imageToAscii(req.files[0].buffer, { colored: false }, (err, converted) => {
    if (err) {
      console.log('conversion error', err);
      return;
    }
    console.log(converted);

    let file = `${__dirname}/ascii/ascii-${filename}`;
    gm(500, 500, 'white')
      .font('Courier.ttf', 8)
      .setFormat('jpeg')
      .drawText(5, 5, converted)
      .stream(function(err, stdout, stderr) {
        stdout.pipe(uploadFromStream());

        function uploadFromStream() {
          var pass = new stream.PassThrough();
          uploadParams.Body = pass;
          uploadParams.Key = Date.now().toString() + '_ascii-' + filename;
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
                `https://s3-us-west-1.amazonaws.com/ascii-it/${
                  uploadParams.Key
                }`,
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
            }
          });
          return pass;
        }
      });
  });
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, function() {
  console.log(`Listening on port ${PORT}`);
});
