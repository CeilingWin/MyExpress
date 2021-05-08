const METHOD = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
}

var Router = module.exports = function(path){
    this.path = path;
    this.listAPI = [];

    this.handleRoute = function(method, pathname, listFunc){
        pathname = this.path + pathname;
        let api = this.listAPI.find(a => a.method === method && a.pathname === pathname);
        if (api){
            listFunc.forEach(element => {
                api.listCallback.push(element);
            });
        } else {
            this.listAPI.push({
                method: method,
                listCallback: listFunc,
                pathname: pathname,
                regex: this.createRegex(pathname)
            });
        }
        return this;
    }

    this.createRegex = function(pathname){
        // TODO: create regex match url with pathname
        if (pathname.indexOf(':') >= 0){
            pathname = pathname.split('/');
            for (let i=1 ; i<pathname.length; i++){
                let element = pathname[i];
                if (element[0] === ':'){
                    element = element.slice(1);
                    element = "(?<" + element + ">\\w+)";
                } else {
                    element = i!==pathname.length -1 ? "(:?/" + element + "/)" : "(:?/" + element +"/?)";
                }
                pathname[i-1] = element;
            }
            pathname.pop();
            pathname = pathname.reduce((sum, v) => sum + v);
        } else {
            if (pathname[pathname.length -1 ] === '/'){
                pathname = pathname + '?';
            }
        }
        pathname = '^' + pathname + '$';
        return new RegExp(pathname,'g');
    }

    this.getAPI = function(req){
        let api = this.listAPI.find(api => api.method === req.method && api.regex.test(req.pathname));
        if (api){
            api.regex.lastIndex = 0;
            let search = api.regex.exec(req.pathname);
            api.regex.lastIndex = 0;
            if (!search) return api;
            let params = search.groups;
            for (key in params){
                req.params[key] = params[key];
            }
        }
        return api;
    }

    this.get = function(pathname, ...listFunc){
        return this.handleRoute(METHOD.GET,pathname,listFunc);
    }
    this.post = function(pathname, ...listFunc){
        return this.handleRoute(METHOD.POST,pathname,listFunc);
    }
    this.put = function(pathname, ...listFunc){
        return this.handleRoute(METHOD.PUT,pathname,listFunc);
    }
    this.delete = function(pathname, ...listFunc){
        return this.handleRoute(METHOD.DELETE,pathname,listFunc);
    }
}

