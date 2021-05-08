const MyExpress = require('./lib/my-express');
const express = require('express');
const route = require('./lib/route');

let app = MyExpress.createServer();

app.use((req,res,next)=>{
    console.log("wellcome!");
    next();
});
app.listen(3000);

let router = new MyExpress.Router();
console.log(router.createRegex("/product/:productID/detail/:detailID"));
console.log(router.createRegex("/product/detail"));
console.log(router.createRegex("/"));

// let trg = new RegExp('^(\/product\/)(?<productID>\\w+)','g');
// let a = trg.exec("/product/abc779");   
// for (attr in a.groups){
//     console.log(attr,":", a.groups[attr]);
// }




