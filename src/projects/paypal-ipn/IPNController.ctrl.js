import paypal from 'paypal-rest-sdk';
import DatabaseController from './DatabaseController.ctrl';
import { validate as validateWebhook } from './paypal.service';
import SheetsController from './SheetsController.ctrl';
import { getUserById } from './spigot.service';

const sheetsController = new SheetsController();
const databaseController = new DatabaseController();

class IPNController {
  constructor() {
    paypal.configure({
      mode: process.env.PAYPAL_MODE || 'sandbox', //sandbox or live
      client_id: process.env.PAYPAL_CLIENT_ID || '',
      client_secret: process.env.PAYPAL_CLIENT_SECRET || '',
    });
  }

  async handleWebhook(req, res) {
    // Send 200 status back to PayPal
    try {
      const valid = await validateWebhook(JSON.stringify(req.body));
      if (!valid) {
        res.sendStatus(400);
        return;
      }

      const { event_type } = req.body;

      if (event_type !== 'PAYMENT.SALE.COMPLETED') {
        res.sendStatus(200);
        return;
      }

      const {
        resource: {
          id,
          amount: { total, currency },
          transaction_fee: { value },
          custom,
          create_time,
        },
      } = req.body;

      if (total !== '9.99' || currency !== 'EUR') {
        res.sendStatus(200);
        return;
      }

      const [actionType, userId, transactionId, resourceId] = custom.split('|');
      if (actionType !== 'resource_purchase' && resourceId !== '30331') {
        res.sendStatus(200);
        return;
      }

      const spigotUser = await getUserById(userId);

      await databaseController.addPurchaseToDatabase(
        userId,
        spigotUser.username,
        (spigotUser.identities || {}).discord || null,
        new Date(create_time)
      );

      sheetsController.handleTritonPurchase({
        date: new Date(create_time),
        spigotUser: spigotUser.username,
        total: parseFloat(total),
        fee: parseFloat(value),
        currency,
        transactionId: id,
        marketplace: 'Spigot',
      });

      res.sendStatus(200);
    } catch (e) {
      console.error('Error while handling PayPal webhook', e);
      res.sendStatus(500);
    }
  }
}

export default IPNController;
