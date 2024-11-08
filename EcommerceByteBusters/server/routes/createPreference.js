import express from "express";
import mercadopago from "mercadopago";
import cors from "cors";

// Verifica la instalación y configuración del SDK
if (!mercadopago.configurations) {
  throw new Error("SDK de Mercado Pago no está configurado correctamente");
}

mercadopago.configurations.setAccessToken('APP_USR-6878027478125365-091209-3cafa42ecdee0c015066a0c6bcc16ef6-1986448269');

const router = express.Router();

router.use(cors());
router.use(express.json());

router.post("/create_preference", async (req, res) => {
  const { title, quantity, price } = req.body;

  let preference = {
    items: [
      {
        title: title,
        quantity: quantity,
        currency_id: 'ARS',
        unit_price: parseFloat(price)
      }
    ],
    back_urls: {
      success: "https://your-success-url.com",
      failure: "https://your-failure-url.com",
      pending: "https://your-pending-url.com"
    },
    auto_return: 'approved',
  };

  try {
    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id });
  } catch (error) {
    console.error("Error al crear la preferencia:", error);
    res.status(500).json({ error: "Error al crear la preferencia" });
  }
});

export default router;
