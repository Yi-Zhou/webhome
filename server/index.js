"use strict";

var http = require("http");

var s = http.createServer(function(req, res) {
  res.end("Hello World");
  console.log("hehe");
});

s.listen(3000);
