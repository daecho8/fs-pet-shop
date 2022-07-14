#!/usr/bin/env node
import fs, { writeFile } from 'fs';
import { readFile } from 'fs/promises';

const subcommand = process.argv[2];

switch(subcommand) {
    case 'read': {
        const index = process.argv[3];
        fs.readFile('./pets.json', 'utf-8', (err, str) => {
            const data =JSON.parse(str);
            if (data[index]) {        // index < data.length && index >= 0
                console.log(data[index]);
            } else {
                console.log(`Usage: node pets.js read INDEX`)
            }
        })
        break;
    }
    case 'create': {
        const age = process.argv[3];
        const kind = process.argv[4];
        const name = process.argv[5];
        if (age && kind && name) {

            fs.readFile('./pets.json', 'utf-8', (err, str) => {
                const pet = {"age": age, "kind": kind, "name": name}
                const data =JSON.parse(str);
                data.push(pet);
                fs.writeFile('./pets.json', JSON.stringify(data), (err, str) => {
                console.log(pet)       //{ age: 3, kind: 'parakeet', name: 'Cornflake' }
                })
            })
        } else {
            console.log(`Usage: node pets.js create AGE KIND NAME`)
            process.exit(1);
        }
        break;
    }
    case 'update': {                // const [,,, index, age, kind, name] = process.argv
        const [,,, index, age, kind, name] = process.argv;
        readFile('pets.json', 'utf-8').then((str) => {
            const data = JSON.parse(str);
            if(data[index]) {
                const pet = data[index];
                pet.age = age;
                pet.kind = kind;
                pet.name = name;
                writeFile('pets.json', JSON.stringify(data));
            } else {
                console.error("error message");
                process.exit(1);
            }
        }).catch((err) => {
            console.log(err, "failed in catch");
            process.exit(1);
        })

    }
    case 'destroy': {

    }
    default: {
        console.error("Usage: node pets.js [read | create | update | destroy]");
        process.exit(1);
    }    
}