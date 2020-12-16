const express = require("express");
const app = express();
const port = process.env.PORT || 8080
const path = require("path");
const fs = require("fs");
const ws = __dirname + "\\..\\..";

app.use(express.static(__dirname + "\\..\\.."));

const error_file = path.join(ws, "error.html");

app.get("/:page", (req, res) =>{

    let user_req = req.originalUrl;
    let size = user_req.length;

    if (size > 5)
        if (user_req.substr(size - 5, size) !== ".html")
            user_req += ".html";
    else
        user_req += ".html";
    
    fs.access(path.join(ws, user_req), (err) => {
        if (!err){
            res.statusCode = 200;
            res.sendFile(path.join(ws, user_req));
        }
        else{
            res.statusCode = 404;
            res.sendFile(error_file);
        }
    });
});

app.listen(port, console.log(`Server listening in port ${port}`));