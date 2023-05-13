import { SnakeGame } from "./snake/index.js";

const d = document.createElement("div");
d.innerText = "A surprise div!";

document.body.appendChild(d);

const sg = new SnakeGame("container");

console.log("loading index.js");

