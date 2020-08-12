import paypal from 'paypal-rest-sdk';
import { promisify } from 'util';

export const validate = (headers, body, webhookId) =>
  promisify(paypal.notification.webhookEvent.verify)(headers, body, webhookId);
