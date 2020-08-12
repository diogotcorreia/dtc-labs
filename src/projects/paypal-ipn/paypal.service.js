import paypal from 'paypal-rest-sdk';
import { promisify } from 'util';

export const validate = promisify(paypal.notification.webhookEvent.getAndVerify);
