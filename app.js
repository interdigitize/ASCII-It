const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const jp2a = require( "jp2a" );
var fs = require('fs')
  , gm = require('gm');
var multer  = require('multer')
// var Promise = require('bluebird');
// Promise.promisifyAll(gm.prototype);

// var upload = multer({ dest: 'uploads/' })
var upload = multer();

const app = express();
const PORT = process.env.PORT || 3000;

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, 'client/build')));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(upload.any());





// Answer API requests.

app.post('/photo', function (req, res, next) {
  let path = `./uploads/${req.files[0].originalname}`;

  var convertBuffer = new Promise((resolve, reject) => {
     gm(req.files[0].buffer, req.files[0].originalname)
      .noise('laplacian')
      .write(path, function (err) {
        if (err) return handle(err);
        console.log('Created an image from a Buffer!');
        resolve();
      });
    });

  convertBuffer.then(() => {
    console.log('starging conversion...');
    jp2a( [ path, "--width=50", "--background=light" ],  function( output ){
      // console.log('converted:', output );
      fs.unlink(path, function(err) {
        if (err) throw err;
        // console.log('file deleted!');
      });

      // gm(200, 400, "#ddff99f3")
      //   .drawText(10, 50, output)
      //   .write(`./ascii/ascii-${req.files[0].originalname}`, function (err) {
      //     console.log(err);
      // });
      // res.send([`./ascii/ascii-${req.files[0].originalname}`, output]);
      res.send(output);
    })
  })
  .catch((err) => {
    //remove the file from uploads
    console.log(err)
    res.send('err');
  })
})

// app.post('/photo', function (req, res, next) {
//   let path = `./uploads/${req.files[0].originalname}`;
//
//   gm(req.files[0].buffer, req.files[0].originalname)
//   .noise('laplacian')
//   .writeAsync(path)
//   .then((path) => {
//     console.log('written')
//     jp2a( [ path, "--width=50", "--background=light" ],  function( output ){
//         console.log('converted:', output );
//
//         res.send(output);
//     })
//   })
//   .catch((err) => {
//     console.log(err)
//   })
// })

  // gm('./uploads/GSFL.jpg')
  //   .resize(width, height)
  //   .noProfile()
  //   .write('./uploads/GSFL.png', function (err) {
  //     if (!err) console.log('done')
  //     else {
  //       console.log(err)
  //     }
  //
  //   });


  // exec(`${jp2a} ([${path}, "--width=50", "--background=light" ], function (output) { console.log('output', output)})`, function(error, data) {
  //   if (error) {
  //     console.log('error', error);
  //   } else {
  //     console.log('data', data);
  //   }
  // });

  // console.log('files', req.files[0]);
  // console.log(jp2a( [ req.files[0].buffer, "--width=50", "--background=light" ],  function( output ){
  //     console.log('output1', output );
  // }))

  // console.log('file', req.file);
  // console.log('body', req.body); will hold the text fields, if there were any


// app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
//   // req.files is array of `photos` files
//   // req.body will contain the text fields, if there were any
// })
//
// var cpUpload = upload.fields([
//   { name: 'avatar', maxCount: 1 },
//   { name: 'gallery', maxCount: 8 }
// ])
//
// app.post('/cool-profile', cpUpload, function (req, res, next) {
//   // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
//   //
//   // e.g.
//   //  req.files['avatar'][0] -> File
//   //  req.files['gallery'] -> Array
//   //
//   // req.body will contain the text fields, if there were any
// })


// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});
