import express from "express";
import pg from "pg";
import basicAuth from "express-basic-auth";

const app = express();
const PORT = 3000;

app.use(express.json());

const pool = new pg.Pool({
    database: 'petshop'
});
    
app.get("/pets", (req, res) => {
    pool.query('SELECT * FROM pets').then((data) => {
        res.send(data.rows);
    });
});

app.get("/pets/:id", (req, res, next) => {
    const id = req.params.id;
    pool.query(`SELECT * FROM pets WHERE id = $1;`, [id]).then((data) => {
        const pet = data.rows[0];        //data.rows.find((row) => row.id === id);
        if(pet) {   //data.rows[id]
            res.send(pet);
        } else {
            res.sendStatus(404);
        }
    }).catch(next);
});

app.post("/pets", (req, res) => {
    const newName = req.body.name;  //const { age, name, kind } = req.body;
    const newAge = Number(req.body.age);
    const newKind = req.body.kind;
    // pool.query(`INSERT INTO pets(name, kind, age) VALUES('${newName}', '${newKind}', '${newAge}')`).then((data) => {
    pool.query(`INSERT INTO pets(name, kind, age) VALUES ($1, $2, $3) RETURNING *;`, [newName, newKind, newAge]).then((data) => {
        console.log(data);
        if (data.rows.length === 0) {
            res.sendStatus(404);
        } else {
            res.send(data.rows[0]);
        }
    })
});

app.patch("/pets/:id", (req, res) => {
    const id =req.params.id;
    const newName = req.body.name; // const { name, age, kind } = req.body
    const newAge = Number(req.body.age);
    const newKind = req.body.kind;
    pool.query(`UPDATE pets SET name = COALESCE($1, name), age = COALESCE($2, age), kind = COALESCE($3, kind)
    WHERE id = $4 RETURNING *;`, [newName, newAge, newKind, id]).then((data) => {
        console.log(data);
        if (data.rows.length === 0) {
            res.sendStatus(404);
        } else {
            res.send(data.rows[0]);
        }
    })
});

app.delete("/pets/:id", (req, res) => {
    const id = req.params.id;
    pool.query(`DELETE FROM pets WHERE id = $1 RETURNING *;`, [id]).then((data) => {
        console.log(data);
        if(data.rows.length === 0) {
            res.sendStatus(404);
        } else {
            res.send(data.rows[0]);
            // res.sendStatus(204);
        }
    });
});

app.use((err, req, res, next)=> {
    res.sendStatus(500);
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
