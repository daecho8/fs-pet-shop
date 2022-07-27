import express, { response } from "express";
import { writeFile } from 'fs/promises';
import { readFile } from "fs/promises"

const PORT = 3000;
const app = express();

app.use(express.json());

app.get("/pets", (req, res) => {
    res.type("text");    //response.set("Conetnet-Type", "text.plain");
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

let id = 3;
const createEntity = (data) => {
    return { id: id++, ...data};
};
app.post("/pets", (req, res) => {
    const newProduct = createEntity(req.body);
    // console.log(req.body);
    res.json(newProduct);
    readFile("pets.json", "utf-8").then((str) => {
        const pets =JSON.parse(str);
        pets.push(newProduct);
        // res.send(pets);
        writeFile("pets.json", JSON.stringify(pets)).then((err) => {
            if(err) {
                res.send(err)
            } else {
                res.send(pets);
            }
        });     
    }).catch(next);
});

app.patch("/pets/:id", (req, res) => {
    // const{ id } = req.params;
    const index = req.params.id;
    const update = req.body;
    readFile("pets.json", "utf-8").then(str => {
        const pets =JSON.parse(str);
        const newPets = pets[index];
        if (newPets) {
            if (update.name) {
                newPets.name = update.name;
            }
            if (update.age) {
                newPets.age = update.age;
            }
            if (update.kind) {
                newPets.kind = update.kind;
            }
        } else {
            res.sendStatus(400);
        }
        writeFile("pets.json", JSON.stringify(pets)).then((err) => {
            if(err) {
                res.send(err)
            } else {
                res.send(newPets);
            }
        });     
});
});

app.delete("/pets/:id", (req, res) => {
    const index = req.params.id;
    readFile("pets.json", "utf-8").then(data => {
        const pets =JSON.parse(data);
        if (pets[index]) {
            pets.splice(index, 1);
            writeFile("pets.json", JSON.stringify(pets)).then((err) => {
                if(err) {
                    res.send(err)
                } else {
                    res.send("Deleted");
                }
            });     
        }
    })
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
