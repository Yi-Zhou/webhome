"use strict";

// Require modules
var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");

// mimeTypes
var mimeTypes = {
  "html": "text/html",
  "jpeg": "image/jpeg",
  "jpg": "image/jpg",
  "png": "image/png",
  "js": "text/javascript",
  "css": "text/css"
}

var s = http.createServer(function(req, res) {

  var uri = url.parse(req.url).pathname;
  var fileName = path.join(process.cwd(), unescape(uri));
  console.log("Loading " + uri);

  var stats;
  try {
    stats = fs.lstatSync(fileName);
  } 
  catch (e) {
    fileName = path.join(process.cwd(), unescape("/404.html"))
    try {
      stats = fs.lstatSync(fileName);
    }
    catch (e) {
      console.log("here");
      res.writeHead(404, {"Content-Type": "text/plain"});
      res.write("404 Not Found.");
      res.end();
      return;
    }
    res.writeHead(302, {
      "Location": "/404.html"
    });
    res.end();
    return;
  }

  if (stats.isFile()) {
    var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
    res.writeHead(200, {
      "Content-Type": mimeType
    });
    var fileStream = fs.createReadStream(fileName);
    fileStream.pipe(res);
  }
  else if (stats.isDirectory()) {
    res.writeHead(302, {
      "Location": "/index.html"
    });
    res.end();
  }
  else {
    res.writeHead(500, {"Content-Type": "text/plain"});
    res.write("500 Internal Error\n");
    res.end();
  }

  return;
});

s.listen(3000);

console.log("Server running at http://127.0.0.0:3000");
