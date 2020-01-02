import gdrawings from './projects/gdrawings/gdrawings';
import IPNController from './projects/paypal-ipn/IPNController.ctrl';

export default (app) => {
  app.get('/gdrawings/:id.png', gdrawings);
  app.post('/paypal-ipn', IPNController.index);
};
