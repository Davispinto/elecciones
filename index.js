const http = require("http");
const fs = require("fs");
const url = require("url");
const { guardarCandidato, getCandidatos, editCandidato, eliminarCandidato, registrarVotos, gethistorial } = require("./consultas");

//base de datos y tabla
// create database elecciones;
// \c elecciones;

// create table candidatos (
//     id serial, 
//     nombre varchar(50), 
//     foto varchar (200), 
//     color varchar(9), 
//     votos int
// 

// create table historial (
//     estado varchar(35) unique, 
//     votos int,
//     ganador varchar(40)
// );


//SERVIDOR BASE
http.createServer(async (req, res) => {
    if (req.url == "/" && req.method == "GET") {
        fs.readFile("index.html", (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end()
            } else {
                res.setHeader("Content-Type", "Text/Html")
                res.end(data)
            }
        })
    };
    //crea
    if (req.url == "/candidato" && req.method == "POST") {
        let body = "";
        req.on("data", (chunk) => {
            body = chunk.toString();
        });
        req.on("end", async () => {
            const candidato = JSON.parse(body);
            try {
                const result = await guardarCandidato(candidato);
                res.statusCode = 201;
                res.end(JSON.stringify(result));
            } catch (e) {
                res.statusCode = 500;
                res.end("dramas con el servidor" + e);
            }
        });
    };
    //lee
    if (req.url == "/candidatos" && req.method == "GET") {
        try {
            const candidatos = await getCandidatos();
            res.end(JSON.stringify(candidatos));
        } catch (e) {
            res.statusCode = 500;
            res.end("ocurrio un problema con el servidor" + e);
        }
    };

    //edit
    if (req.url == "/candidato" && req.method == "PUT") {
        let body = "";
        req.on("data", (chunk) => {
            body = chunk.toString();
        });
        req.on("end", async () => {
            const candidato = JSON.parse(body);
            try {
                const result = await editCandidato(candidato);
                res.statusCode = 201;
                res.end(JSON.stringify(result));
            } catch (e) {
                res.statusCode = 500;
                res.end("dramas con el servidor" + e);
            }
        });
    };

    //elimina
    if (req.url.startsWith("/candidato?id") && req.method == "DELETE") {
        try {
            let { id } = url.parse(req.url, true).query
            await eliminarCandidato(id);
            res.end('candidato eliminado');
        } catch (e) {
            res.statusCode = 500;
            res.end("ocurrio un problema con el servidor" + e);
        }
    };

    //conteo de votos
    if (req.url == "/votos" && req.method == "POST") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", async () => {
            try {
                const voto = JSON.parse(body);
                const result = await registrarVotos(voto);
                res.statusCode = 201;
                res.end(JSON.stringify(result));
            } catch (e) {
                res.statusCode = 500;
                res.end("dramas con el servidor" + e);
            }
        });
    };

    //mostrar historial
    if (req.url == "/historial" && req.method == "GET") {
        try {
            const historial = await gethistorial();
            res.end(JSON.stringify(historial));
        } catch (e) {
            res.statusCode = 500;
            res.end("ocurrio un problema con el servidor" + e);
        }
    };

}).listen(3000, console.log("server 3000 on"));