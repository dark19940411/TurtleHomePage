/**
 * Created by turtle on 2017/11/7.
 */
var http = require("http");

http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});

    response.end('Hello world!');
}).listen(8888);

console.log('Server Running at http://127.0.0.1:8888');