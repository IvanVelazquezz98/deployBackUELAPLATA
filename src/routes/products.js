const { Router } = require("express");
const router = Router();
const { Product } = require("../db");
const mercadopago = require("mercadopago");
const nodemailer = require("nodemailer");

mercadopago.configure({
  client_id: "2643229451434574",
  client_secret: "WNdSVwwEOfGTRMrBJo9POtUcMzGEfCLu",
});

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "uelocal64@gmail.com", // Cambia esto al correo electrónico desde el que enviarás los correos
    pass: "UE64Local", // Cambia esto a tu contraseña
  },
});

router.post("/pagar", async (req, res) => {
  try {
    const products = req.body.products;
    const totalPrice = req.body.totalPrice;
    const clientEmail = req.body.clientEmail; // Agrega el correo electrónico del cliente en el request body

    // Crear un array de ítems para la preferencia de pago
    const items = products.map((product) => {
      return {
        title: product.name,
        unit_price: product.precio,
        quantity: product.cantidad,
      };
    });

    // Crear una preferencia de pago con los ítems y el precio total
    const preference = {
      items,
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
      },
      back_urls: {
        success: "http://localhost:3001/products/success",
        failure: "http://localhost:3001/products/failure",
        pending: "http://localhost:3001/products/pending",
      },
      auto_return: "approved",
      external_reference: "TU_REFERENCIA_EXTERNA",
    };

    // Crear la preferencia en Mercado Pago
    const preferenceResponse = await mercadopago.preferences.create(preference);

    const init_point = preferenceResponse.body.init_point;

    // Enviar correo electrónico de confirmación al cliente
    sendConfirmationEmail(clientEmail, products);

    res.status(200).json({ init_point });
  } catch (error) {
    console.error("Error al generar la preferencia de pago:", error);
    res.status(500).json({ error: "Error al generar la preferencia de pago" });
  }
});

router.get("/success", (req, res) => {
  res.send("Pago exitoso");
});

router.get("/failure", (req, res) => {
  res.send("Pago fallido");
});

router.get("/pending", (req, res) => {
  res.send("Pago pendiente");
});

const sendConfirmationEmail = (clienteEmail, productos) => {
  const mailOptions = {
    from: "tucorreo@gmail.com", // Cambia esto al correo electrónico desde el que enviarás los correos
    to: clienteEmail,
    subject: "Confirmación de Compra",
    html: `<p>¡Gracias por tu compra!</p>
           <p>Productos comprados:</p>
           <ul>
             ${productos
               .map(
                 (producto) =>
                   `<li>${producto.name} - Cantidad: ${producto.cantidad} - Talle: ${producto.talle} - Precio: ${producto.precio}</li>`
               )
               .join("")}
           </ul>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error enviando el correo electrónico:", error);
    } else {
      console.log("Correo electrónico enviado:", info.response);
    }
  });
};


router.get("/all", async (req, res, next) => {
  try {
    let app = await Product.findAll();

    res.send(app);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    let app = await Product.findByPk(id);

    if (!app) {
      return res.status(404).send("Game by Id doesn't exist");
    }
    res.status(200).send(app);
  } catch (err) {
    next(err);
  }
});

router.post("/createProduct", async (req, res, next) => {
  try {
    const {
      name,
      photo,
      tipo,
      precio,
      color,
      talles,
      talleMin,
      talleMax,
      especial,
    } = req.body;

    const productCreate = await Product.create({
      name,
      photo,
      tipo,
      precio,
      color,
      talles,
      talleMin,
      talleMax,
      especial,
    });
    res.status(200).send({ productCreate, msg: "Game successfully created" });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    let id = req.params.id;

    await Product.destroy({
      where: { id: id },
    });
    res.status(200).send("Deleted product");
  } catch (err) {
    res.status(404).send("Could not delete the product");
  }
});

router.put("/update", async (req, res, next) => {
  try {
    let {
      id,
      name,
      photo,
      tipo,
      precio,
      color,
      talles,
      talleMin,
      talleMax,
      especial,
    } = req.body;

    //   let { idProduct } = req.params;

    const product = await Product.findByPk(id);
    try {
      await product?.update({
        id,
        name,
        photo,
        tipo,
        precio,
        color,
        talles,
        talleMin,
        talleMax,
        especial,
      });
      res.status(200).send(product);
      console.log(product);
    } catch (e) {
      console.log("ERROR", e);
    }
  } catch (e) {
    next(e);
  }
});
module.exports = router;
