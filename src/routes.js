import istcalrewrite from './projects/istcalrewrite/istcalrewrite';
import gdrawings from './projects/gdrawings/gdrawings';
import IPNController from './projects/paypal-ipn/IPNController.ctrl';

export default (app) => {
  app.get(/\/istcalrewrite\/(.+)/, istcalrewrite);

  app.get('/gdrawings/:id.png', gdrawings);

  const ipnController = new IPNController();
  app.post('/paypal-webhook/', ipnController.handleWebhook);
  app.post('/paypal-ipn/', ipnController.handleWebhook);
};
