var http = require('http');
var fs = require('fs');
var path = require('path');

// Don't add an encoding type argument
// This will cause it to return a string. We want the Buffer object of file contents
// The multipart form-data body needs to have CLRF (/r/n) line endings
// You can change the file to use invalid example ones:
//   - body-with-invalid-boundaries.txt
//   - body-with-invalid-line-endings.txt
var bodyData = fs.readFileSync(path.resolve(__dirname, './body.txt'));

var reqOptions = {
  method: 'POST',
  host: 'localhost',
  port: 9000,
  path: '/upload',
  headers: {
    'Connection': 'keep-alive',
    'Content-Type': 'multipart/form-data; boundary=--123456',
    'Content-Length': Buffer.byteLength(bodyData)
  }
};

var postReq = http.request(reqOptions, function (res) {
  res.setEncoding('utf8');
  res.on('data', function (data) {
    console.log('Server responded with: ' + data);
  });
});

postReq.on('error', function (e) {
  console.log(`Problem with request: ${e.message}`);
});

postReq.write(bodyData);
postReq.end();
