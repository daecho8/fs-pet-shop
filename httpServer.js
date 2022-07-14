// import http from "http";
// import fs from "fs";

// const server = http.createServer((req, res) => {
//     //when receiving a GET request to /pets
//     if (req.url === "/pets" && req.method === "GET") {
//         // read pets.json and return contents
//         fs.readFile("pets.json", "utf-8", (err, data) => {
//            res.end(data);
//         });
//     } else {
//         res.writeHead(404);
//         res.end();
//     }
// });


// server.listen(4000, () => {
//     console.log("server started on port 4000");
// });

import http from "http";
import fs from "fs/promises";
import { stringify } from "querystring";

const petRegExp = /^\/pets\/(.*)$/; 

const server = http.createServer((req, res) => {
    const matches = req.url.match(petRegExp);
    if (req.url === "/pets" && req.method === "GET") {      //when receiving a GET request to /pets
        fs.readFile("pets.json", "utf-8").then((str) => {
            const data = JSON.parse(str);
            res.end(JSON.stringify(data));
        });
    } else if (matches && req.method === "GET") {
        const id = matches[1];
        fs.readFile("pets.json", "utf-8").then((str) => {
            const data =JSON.parse(str);
            if (data[id]) {
                res.end(JSON.stringify(data[id]));
            } else {
                res.writeHead(404);
                res.end();
            }
        }); 
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(4000, () => {
    console.log("server started on port 4000");
});