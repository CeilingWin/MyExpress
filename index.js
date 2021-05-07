const MyExpress = require('./lib/my-express');

let app = MyExpress.createServer();

app.get("/abc",function(req,res){
    console.log(req.url);
});

app.listen(3000);
