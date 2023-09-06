const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();



const videogameRoute = require("./products");


router.use("/products" , videogameRoute)

module.exports = router;

