import express from "express";
import productRouter from "./api/products.router.js";
import cartsRouter from "./api/carts.router.js";
// import { loggerMid } from "./middlewares/loggerMid.js";
import morgan from 'morgan';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(loggerMid);
app.use(morgan('dev'));

app.use('/api/products', productRouter);
app.use('/api/carts', cartsRouter);

const PORT = 8080;

app.listen(PORT, () => console.log(`ready  ${PORT}`));