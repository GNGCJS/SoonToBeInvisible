const express = require("express");
const app = express();
const port = process.env.PORT || 8080
const path = require("path");
const fs = require("fs");
const ws = __dirname + "\\..\\..";
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ attrkey: "ATTR" });
const bodyParser = require("body-parser");
const error_file = path.join(ws, "error.html");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "\\..\\.."));
app.use(bodyParser.urlencoded({ extended: false }));


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
                res.write(`<label lang='en' class='nome_animal'>${String(animal["comum"])}</label>`);
                res.write("</div>");
                res.write("<div class='body'>");
                if(parseInt(String(animal["photos"][0]["photo"][0]).length) !== 0) {
                    res.write(`<img class="imagem_animal" src="${String(animal["photos"][0]["photo"][0])}" alt="${String(animal["comum"]).replace("'","").replace(" ", "")}" />`);
                } 
                else {
                    res.write(`<img class="imagem_animal" src="assets/images/placeholder.png" alt="${String(animal["comum"]).replace("'","").replace(" ", "")}" />`);
                    //console.log(String(animal["id"]));    
                }
                res.write("</div>");
                res.write("<div class='footer'>");
                res.write("<form action='detalhes' method='POST'>")
                res.write(`<input name='a_id' class="animal_id" type='text' readonly value='${animal["id"]}' />`);
                res.write("<button class='sobrebt' type='submit'>");
                res.write("Sobre");
                res.write("</button>");
                res.write("</form>")
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

    res.statusCode = 200;
    
    res.end(() => {
        console.log("Página animais renderizada com sucesso!");
    });
});

app.post("/galeria", (req, res) => {
    let xml_string = fs.readFileSync(path.join(__dirname, "data.xml"), "utf-8");

    res.render("galeria_header", (err, html, str) => {
        res.write(html);
    });

    parser.parseString(xml_string, (err, data) => {
        if(err === null){
            data["animais"]["animal"].forEach(animal => {
                if(parseInt(String(animal["photos"][0]["photo"][0]).length) !== 0){
                    animal["photos"][0]["photo"].forEach(foto => {
                        res.write("<div class='caixa'>");
                        res.write("<figure>")
                        res.write(`<figcaption lang='en'>${String(animal["comum"])}</figcaption>`);
                        res.write(`<a href="${String(foto)}" target="blank">`)
                        res.write(`<img src="${String(foto)}" alt="${String(animal["comum"]).replace("'","").replace(" ", "")}" />`);
                        res.write("</a>");
                        res.write("</figure>")
                        res.write("</div>");
                    });
                }
                else{
                    res.write("<div class='caixa'>");
                    res.write("<figure>")
                    res.write(`<figcaption lang='en'>${String(animal["comum"])}</figcaption>`);
                    res.write(`<img src="assets/images/placeholder.png" alt="${String(animal["comum"]).replace("'","").replace(" ", "")}" />`);   
                    res.write("</figure>")
                    res.write("</div>");  
                }
            });
        }
        else{
            console.log(err);
        }
    });

    res.render("galeria_footer", (err, html, str) => {
        res.write(html);
    });

    res.statusCode = 200;

    res.end(() => {
        console.log("Página galeria renderizada com sucesso!");
    })

});

app.post("/detalhes", (req, res) => {
    const { a_id } = req.body;

    let xml_string = fs.readFileSync(path.join(__dirname, "data.xml"), "utf-8");

    res.render("detalhes_header", (err, html, str) => {
        res.write(html);
    });

    parser.parseString(xml_string, (err, data) => {
        if(err === null){
            data["animais"]["animal"].forEach(animal => {
                if(String(animal["id"]) === String(a_id)){
                    res.write(`<h2 lang='en' class='text_detalhes'>${String(animal["comum"])}</h2><br>`);
                    res.write("<article class='rect_dir'>");
                    res.write("<header>");
                    res.write(`<h3 lang='la' class='text_detalhes2'>${String(animal["cientifico"])}</h3><br>`);
                    res.write("</header>");
                    res.write(`<p lang='en'>${animal["sobre"]}</p>`);
                    res.write("</article>");
                    res.write("<div class='rect_meio'>");
                    res.write("<h2 Class='text_detalhes3'>Detalhes</h2>");                
                    res.write("<table class='tabela_detalhes'>");
                    res.write("<thead>");
                    res.write("<tr>");  
                    res.write("<td colspan='2' class='thead1'>Detalhes disponiveis do animal</td>"); 
                    res.write("</tr>"); 
                    res.write("</thead>");
                    res.write("<tbody>");
                    res.write("<tr>");
                    res.write("<td class='td1'><strong>Estado:</strong></td>");
                    res.write(`<td lang='en' class='td2'>${String(animal["estado"])}</td>`);
                    res.write("</tr>");
                    res.write("<tr>");
                    res.write("<td class='td1'><strong>População:</strong> </td>");
                    res.write(`<td lang='en' class='td2'>${String(animal["populacao"])}</td>`);
                    res.write("</tr>");
                    res.write("<tr>");
                    res.write("<td class='td1'><strong>Peso:</strong></td>");
                    res.write(`<td lang='en' class='td2'>${String(animal["peso"])}</td>`);
                    res.write("</tr>");
                    res.write("<tr>");
                    res.write("<td class='td1'><strong>Tamanho:</strong></td>");
                    res.write(`<td lang='en' class='td2'>${String(animal["tamanho"])}</td>`);
                    res.write("</tr>");
                    res.write("<tr>");
                    res.write("<td class='td1'><strong>Localizações:</strong></td>");
                    res.write(`<td lang='en' class='td2'>${String(animal["localizacoes"][0]["localizacao"][0])}</td>`);
                    res.write("</tr>");
                    res.write("<tr>");
                    res.write("<td class='td1'><strong>Habitats:</strong></td>");
                    res.write(`<td lang='en' class='td2'>${String(animal["habitats"][0]["habitat"][0])}</td>`);
                    res.write("</tr>");
                    res.write("<tr>");
                    res.write("<td class='td1'><strong>Altura:</strong></td>");
                    res.write(`<td lang='en' class='td2'>${String(animal["altura"])}</td>`);
                    res.write("</tr>");
                    res.write("</tbody>");
                    res.write("<tfoot>");
                    res.write("<tr>");
                    res.write("<td rowspan='2' class='thead1'>Fonte: <a href='https://www.worldwildlife.org/' target='blank'> WWF</a></td>");
                    res.write("<td></td>");
                    res.write("</tr>");
                    res.write("<tr><td></td></tr>")
                    res.write("</tfoot>");
                    res.write("</table>");
                    res.write("</div>");

                    res.write("<div class='rect_esq'>");
                    res.write("<div class='img_show'>");
                    res.write("<div class='seta_esquerda' id='seta_left'>");
                    res.write("<img class='seta' src='assets/images/seta.png' alt='seta' />");
                    res.write("</div>");
                    res.write("<div class='seta_direita' id='seta_right'>");
                    res.write("<img class='seta' src='assets/images/seta.png' alt='seta' />");
                    res.write("</div>");
                    res.write("<span class='helper'></span>");
                    if(String(animal["photos"][0]["photo"][0]) !== ""){
                        res.write(`<a href='${String(animal["photos"][0]["photo"][0])}' target='blank'>`);
                        res.write(`<img class='detalhes_img' src="${String(animal["photos"][0]["photo"].shift())}" alt='${String(animal["comum"]).replace(" ", "").replace("'", "")}' />`);                
                        res.write("</a>");
                        animal["photos"][0]["photo"].forEach(foto => {
                            res.write(`<a href='${String(foto)}' target='blank'>`);
                            res.write(`<img class='detalhes_img hidden' src="${String(foto)}" alt='${String(animal["comum"]).replace(" ", "").replace("'", "")}' />`);
                            res.write("</a>");
                        });
                    }
                    else{
                        res.write(`<img class='detalhes_img' src="assets/images/placeholder.png" alt='${String(animal["comum"]).replace(" ", "").replace("'", "")}' />`);
                    }
                    res.write("</div>");
                    res.write("</div>");
                }
            });
        }
        else{
            console.log(err);
        }
    });

    res.render("detalhes_footer", (err, html, str) => {
        res.write(html);
    });

    res.statusCode = 200;

    res.end(() => {
        console.log("Página detalhes renderizada com sucesso!");
    })
});

app.post("/received", (req, res) => {
    const {email, nome, ultimo, report} = req.body;

    console.log(`\nO utlizador com o email:${email}\nColocou a seguinte dúvida:${report}`);
    console.log(`O primeiro e último nome do utilizador são ${nome} ${ultimo}.`);

    res.sendFile(path.join(ws, "contacto.html"))
});

app.listen(port, console.log(`Server listening in port ${port}`));