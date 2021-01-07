const express = require("express");
const app = express();
const port = process.env.PORT || 8080
const path = require("path");
const fs = require("fs");
const ws = __dirname + "\\..\\..";
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ attrkey: "ATTR" });

app.set("view engine", "ejs");
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

app.post("/animais", (req, res) => {
    let xml_string = fs.readFileSync(path.join(__dirname, "data.xml"), "utf-8");

    res.render("animais_header", (err, html, str) => {
        res.write(html);
    });

    parser.parseString(xml_string, (err, data) => {
        if (err === null) {
            data["animais"]["animal"].forEach(animal => {
                res.write("<div class='carta'>");
                res.write("<div class='header'>")
                res.write(`<label class='nome_animal'>${String(animal["comum"])}</label>`);
                res.write("</div>");
                res.write("<div class='body'>");
                if(parseInt(String(animal["photos"][0]["photo"][0]).length) !== 0) {
                    res.write(`<img class="imagem_animal" src="${String(animal["photos"][0]["photo"][0])}" alt="${String(animal["comum"]).replace("'","").replace(" ", "")}" />`);
                } 
                else {
                    res.write(`<img class="imagem_animal" src="${'assets/images/placeholder.png'}" alt="${String(animal["comum"]).replace("'","").replace(" ", "")}" />`);
                    console.log(String(animal["id"]));    
                }
                res.write("</div>");
                res.write("<div class='footer'>");
                res.write("<button class='sobrebt'>");
                res.write("Sobre");
                res.write("</button>");
                res.write("</div>");
                res.write("</div>");
            });
        } else {
            console.log(err);
        }
    });

    res.render("animais_footer", (err, html, str) => {
        res.write(html);
    });

    res.end(() => {
        console.log("Page rendered!");
    });
});

app.post("/galeria", (req, res) => {
    let xml_string = fs.readFileSync(path.join(__dirname, "data.xml"), "utf-8");

    res.render("galeria_header", (err, html, str) => {
        res.write(html);
    });

    parser.parseString(xml_string, (err, data) => {
        data["animais"]["animal"].forEach(animal => {
            
            if(parseInt(String(animal["photos"][0]["photo"][0]).length) !== 0){
                animal["photos"][0]["photo"].forEach(foto => {
                    res.write("<div class='caixa'>");
                    res.write(`<p>${String(animal["comum"])}</p>`);
                    res.write(`<img src="${String(foto)}" alt="${String(animal["comum"]).replace("'","").replace(" ", "")}" />`);
                    res.write("</div>");
                });
            }
            else{
                res.write("<div class='caixa'>");
                res.write(`<p>${String(animal["comum"])}</p>`);
                res.write(`<img src="${'assets/images/placeholder.png'}" alt="${String(animal["comum"]).replace("'","").replace(" ", "")}" />`);   
                res.write("</div>");
                //console.log(String(animal["id"]));    
            }
        });
    });

    res.render("galeria_footer", (err, html, str) => {
        res.write(html);
    });

    res.end(() => {
        console.log("Page rendered");
    })

});

app.listen(port, console.log(`Server listening in port ${port}`));