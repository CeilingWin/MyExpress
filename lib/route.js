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
                element = "(:?/" + element + ")";
                pathname[i-1] = element;
            }
        } else {
            pathname = [pathname];
        }
        return pathname;
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

