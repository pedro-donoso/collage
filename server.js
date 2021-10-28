const express = require("express");
const app = express();
const expressFileUpload = require("express-fileupload");
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  expressFileUpload({
    limits: { fileSize: 5000000 },
    abortOnLimit: true,
    responseOnLimit: "El peso de tu imagen supera el limite (hasta 5M)",
  })
);

app.use(express.static("web"));

app.use("/imgs", express.static(__dirname + "/imagen"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/web/formulario.html");
});

app.get("/imagen", (req, res) => {
  res.sendFile(__dirname + "/web/collage.html");
});

app.post("/imagen", (req, res) => {
  const { target_file } = req.files;
  const { posicion } = req.body;
  target_file.mv(`${__dirname}/imagen/imagen-${posicion}.jpg`, (error) => {
    error ? res.send("Lo siento, ocurrió un error al intentar hacer el upload") : res.redirect("/imagen");
  });
});

app.get("/deleteImg/:nombre", (req, res) => {
  const { nombre } = req.params;
  fs.unlink(`${__dirname}/imagen/${nombre}`, (error) => {
    error
      ? res.send(`<h2>Error al intentar borrar imagen<br /><a href="/collage.html">Regresar</a></h2> <style>
    body {
      background-color: black;
      color: white;
      text-align: center;
      padding: 10px;
    }</style>`)
      : res.redirect("/imagen");
  });
});

app.listen(3000, () => console.log("Server on"));
