import istcalrewrite from './projects/istcalrewrite/istcalrewrite.js';
import gdrawings from './projects/gdrawings/gdrawings.js';
import IPNController from './projects/paypal-ipn/IPNController.ctrl.js';

export default (app) => {
  app.get(/\/istcalrewrite\/(.+)/, istcalrewrite);

  app.get('/gdrawings/:id.png', gdrawings);

  const ipnController = new IPNController();
  app.post('/paypal-webhook/', ipnController.handleWebhook);
  app.post('/paypal-ipn/', ipnController.handleWebhook);
};
