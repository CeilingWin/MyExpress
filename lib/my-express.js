'use strict'

const http = require('http');
const url = require('url');
const Router = require('./route');

module.exports.createServer = function(){
    var app = Object(Application);
    console.log(JSON.stringify(app));
    app.init();
    return app;
}
module.exports.Router = Router;

var Application = {
    // attributes
    port: null,
    routers: [],
    middleware: [],
    server: null,
    
    // method
    init: null,
    listen: null,
    requestListener: null,
};

Application.init = function(){
    this.server = http.createServer(this.requestListener.bind(this));
    console.log("Created server");
}

Application.listen = function(port){
    this.port = port;
    this.server.listen(this.port);
}

Application.requestListener = function(req, res){
    this._handleRawRequest(req);

    // pipeline middleware
    req.middlewareIndex = 0;
    req.middleware = this.middleware;
    var next = function(){
        if (req.middlewareIndex === req.middleware.length){
            // done 
            console.log("done middleware");
        } else {
            let middlewareFunc = req.middleware[req.middlewareIndex];
            req.middlewareIndex += 1;
            middlewareFunc && middlewareFunc(req, res, next);
        }
    }
    next();
}

Application._handleRawRequest = function(req){
    let urlData = url.parse(req.url,true);
    req.pathname = urlData.pathname;
    req.params = urlData.query;
}

Application.use = function(fn){
    if (typeof fn === 'function') {
        this.middleware.push(fn);
    } else {
        throw Error("Middleware must be a function!");
    }
}

