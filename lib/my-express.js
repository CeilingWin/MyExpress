'use strict'

const http = require('http');
const url = require('url');

module.exports.createServer = function(){
    var app = Object(MyExpress);
    console.log(JSON.stringify(app));
    app.init();
    return app;
}

const METHOD = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
}

var MyExpress = {
    // attributes
    port: null,
    routers: [],
    server: null,
    
    // method
    init: null,
    listen: null,
    requestListener: null,
};

MyExpress.init = function(){
    this.server = http.createServer(this.requestListener.bind(this));
    console.log("Created server");
}

MyExpress.listen = function(port){
    this.port = port;
    this.server.listen(this.port);
}

MyExpress.requestListener = function(req, res){
    let urlData = url.parse(req.url,true);
    let method = req.method;
    let router = this.routers.find(r => r.method === method && r.pathname === urlData.pathname);
    router && router.callback && router.callback(req,res);
}

MyExpress.get = function(pathname,callback){
    this.routers.push({
        method: METHOD.GET,
        pathname: pathname,
        callback: callback
    })
}

