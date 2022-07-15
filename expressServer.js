import express from 'express';
import { writeFile } from 'fs/promises';
import { readFile } from "fs/promises"

const app = express();
const PORT = 3000;

//middleware
const myLogger = function (req, res, next) {
    console.log(req.ip);
    next();
}

app.use(myLogger);
app.use(express.json());

app.get("/pets", (req, res) => {            //Return all pets as JSON
    readFile("pets.json", "utf-8").then(str => {
        const pets =JSON.parse(str);
        res.send(pets);
    })
});

app.get("/pets/:id", (req, res, next) => {
    readFile("pets.json", "utf-8").then(str => {
    const pets =JSON.parse(str);
    // console.log(req.params);
    if (pets[req.params.id]) {
        res.send(pets[req.params.id]);  //('user ' + req.params.id)
    } else {
        res.writeHead(404);
        res.end();
    }
    }).catch(next);
}); 

app.post("/pets", (req, res, next) => {
    const body =req.body

    console.log(body);
    readFile("pets.json", "utf-8").then((str) => {
        const pets =JSON.parse(str);
        pets.push(body);
        // res.send(pets);
        writeFile("pets.json", JSON.stringify(pets)).then((err) => {
            if(err) {
                res.send(err)
            } else {
                res.send(pets);
            }
        });     
    }).catch(next);
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});