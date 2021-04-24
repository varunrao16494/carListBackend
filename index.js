const app = require("./app");

let http = require('http').Server(app);
const port = 3000;

 http.listen(port, function () {
    console.log('listening in http://localhost:' + port);
}); 