import SheetsController from './SheetsController.ctrl';
import PayPalService from './paypal.service';

const TRITON_REGEX = /resource_purchase\|\d+\|[\w\d]+\|30331/;

const sheetsController = new SheetsController();

class IPNController {
  static async index(req, res) {
    // Send 200 status back to PayPal
    res.status(200).send('OK');
    res.end();

    const body = req.body || {};

    // Validate IPN message with PayPal
    try {
      const isValidated = await PayPalService.validate(body);
      if (!isValidated) {
        console.error('Error validating IPN message.');
        return;
      }

      // IPN Message is validated!
      if (TRITON_REGEX.test(body.custom)) sheetsController.handleTritonPurchase(body);
    } catch (e) {
      console.error(e);
    }
  }
}

export default IPNController;
