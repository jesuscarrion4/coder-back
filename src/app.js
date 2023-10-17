const express = require("express");
const ProductManager = require("./ProductManager.js");
const ProductManager = new ProductManager();

const app  = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));