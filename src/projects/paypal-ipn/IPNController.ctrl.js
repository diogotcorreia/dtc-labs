import SheetsController from './SheetsController.ctrl';
import { validate as validateWebhook } from './paypal.service';
import { getUserById } from './spigot.service';

const sheetsController = new SheetsController();

class IPNController {
  async handleWebhook(req, res) {
    // Send 200 status back to PayPal
    try {
      const data = await validateWebhook(
        req.headers,
        req.body,
        process.env.PAYPAL_WEBHOOK_ID || ''
      );
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
