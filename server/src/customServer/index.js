const server = require("./server");
const router = require('./router');
const requestHandlers = require("./requestHandlers");

const routes = ['get', 'publish'];

var handle = {};

handle["/"] = requestHandlers[routes[0]];

routes.forEach(route => handle[route] = requestHandlers[route]);

server.start(router.route, handle);
