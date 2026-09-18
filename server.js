const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/canciones", (req, res) => {
    const repertorio = JSON.parse(
        fs.readFileSync("repertorio.json", "utf8")
    );

    res.json(repertorio);
});

app.post("/canciones", (req, res) => {
    const nuevaCancion = req.body;

    const repertorio = JSON.parse(
        fs.readFileSync("repertorio.json", "utf8")
    );

    repertorio.push(nuevaCancion);

    fs.writeFileSync(
        "repertorio.json",
        JSON.stringify(repertorio, null, 2)
    );

    res.status(201).json(nuevaCancion);
});

app.put("/canciones/:id", (req, res) => {
    const { id } = req.params;
    const cancionActualizada = req.body;

    const repertorio = JSON.parse(
        fs.readFileSync("repertorio.json", "utf8")
    );

    const index = repertorio.findIndex(
        (cancion) => cancion.id == id
    );

    if (index === -1) {
        return res.status(404).json({
            mensaje: "Canción no encontrada"
        });
    }

    repertorio[index] = cancionActualizada;

    fs.writeFileSync(
        "repertorio.json",
        JSON.stringify(repertorio, null, 2)
    );

    res.json(cancionActualizada);
});

app.delete("/canciones/:id", (req, res) => {
    const { id } = req.params;

    const repertorio = JSON.parse(
        fs.readFileSync("repertorio.json", "utf8")
    );

    const index = repertorio.findIndex(
        (cancion) => cancion.id == id
    );

    if (index === -1) {
        return res.status(404).json({
            mensaje: "Canción no encontrada"
        });
    }

    const cancionEliminada = repertorio.splice(index, 1);

    fs.writeFileSync(
        "repertorio.json",
        JSON.stringify(repertorio, null, 2)
    );

    res.json({
        mensaje: "Canción eliminada correctamente",
        cancion: cancionEliminada[0]
    });
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});