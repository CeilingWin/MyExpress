const MyExpress = require('./lib/my-express');
const express = require('express');
const route = require('./lib/route');
const debug = require('debug');

let app = MyExpress.createServer();
var count = 0;
app.use((req,res,next)=>{
    console.log("welcome!");
    next();
});

app.use((req,res,next)=>{
    console.log("request ",count," st");
    count += 1;
    next();
});

app.get("/home",(req,res, next)=>{
    console.log("get home");
    res.write("Ok ajsfo oseijf eosjf eof esjf");
    next();
});

app.get("/",(req, res, next)=>{
    res.write("Welcome home page");
    next();
});

let productRouter = new MyExpress.Router('/product');
productRouter.get('/',(req, res, next)=>{
    res.write("Get all product");
    next();
}).get('/:productID',(req,res,next)=>{
    res.write("get productID: " + req.params.productID);
    next();
});

app.useRouter(productRouter);

// console.log(productRouter.listAPI);
app.listen(3000);




