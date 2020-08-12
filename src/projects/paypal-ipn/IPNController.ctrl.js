import SheetsController from './SheetsController.ctrl';
import { validate as validateWebhook } from './paypal.service';
import { getUserById } from './spigot.service';
import paypal from 'paypal-rest-sdk';

const sheetsController = new SheetsController();

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
      const data = await validateWebhook(req.body);
      const {
        event_type,
        resource: {
          id,
          amount: { total, currency },
          transaction_fee: { value },
          custom,
          create_time,
        },
      } = data;

      if (event_type !== 'PAYMENT.SALE.COMPLETED' || total !== '9.99' || currency !== 'EUR') {
        res.sendStatus(200);
        return;
      }

      const [actionType, userId, transactionId, resourceId] = custom.split('|');
      if (actionType !== 'resource_purchase' && resourceId !== '30331') {
        res.sendStatus(200);
        return;
      }

      const spigotUser = await getUserById(userId);

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
