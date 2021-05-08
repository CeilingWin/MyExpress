'use strict'

const http = require('http');
const url = require('url');
const Router = require('./route');

module.exports.createServer = function(){
    var app = Object(Application);
    app.init();
    return app;
}
module.exports.Router = Router;

var Application = {
    // attributes
    port: null,
    routers: [],
    middleware: [],
    rootRouter: null,
    server: null,
    
    // method
    init: null,
    listen: null,
    requestListener: null,
};

Application.init = function(){
    this.server = http.createServer(this.requestListener.bind(this));
    this.rootRouter = new Router('');
    this.routers.push(this.rootRouter);
    console.log("Created server");
}

Application.listen = function(port){
    this.port = port;
    this.server.listen(this.port);
    console.log("Server is listening on port:",port);
}

Application.requestListener = function(req, res){
    this._handleRawRequest(req);

    // pipeline middleware
    req.middlewareIndex = 0;
    req.middleware = this.middleware;
    let done = this.onRouter.bind(this);
    var next = function(){
        if (req.middlewareIndex === req.middleware.length){
            // done 
            // console.log("done middleware");
            done(req,res);
        } else {
            let middlewareFunc = req.middleware[req.middlewareIndex];
            req.middlewareIndex += 1;
            middlewareFunc && middlewareFunc(req, res, next);
        }
    }
    next();
}

Application.onRouter = function(req, res){
    let api;
    for (let i=0; i<this.routers.length; i++){
        api = this.routers[i].getAPI(req);
        if (api){
            break;
        }
    }
    if (api){
        req.callbackIndex = 0;
        req.callbacks = api.listCallback;
        let done = this.response;
        var next = function(){
            if (req.callbackIndex === req.callbacks.length){
                // console.log("done, send response to client");
                done(res);
            } else {
                let callback = req.callbacks[req.callbackIndex];
                req.callbackIndex += 1;
                callback && callback(req, res, next);
            }
        }
        next();
    } else {
        // TODO: handle error 404
        console.log("can not found api");
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end();
    }
}

Application.response = function(res){
    // res.writeHead(200, {'Content-Type': 'text/html'});
    res.end();
}


Application._handleRawRequest = function(req){
    let urlData = url.parse(req.url,true);
    req.pathname = urlData.pathname.trim();
    req.params = urlData.query || {};
}

Application.use = function(fn){
    if (typeof fn === 'function') {
        this.middleware.push(fn);
    } else {
        throw Error("Middleware must be a function!");
    }
}

Application.useRouter = function(router){
    if (this.routers.find(r => r.path === router.path)) throw Error("Router with path "+router.path+" exists!");
    this.routers.push(router);
}

Application.get = function(pathname, ...listFunc){
    this.rootRouter.get(pathname, ...listFunc);
    return this;
}

Application.post = function(pathname, ...listFunc){
    this.rootRouter.post(pathname, ...listFunc);
    return this;
}

Application.put = function(pathname, ...listFunc){
    this.rootRouter.put(pathname, ...listFunc);
    return this;
}

Application.delete = function(pathname, ...listFunc){
    this.rootRouter.delete(pathname, ...listFunc);
    return this;
}



