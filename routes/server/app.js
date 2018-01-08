import authModel from '../../middleware/auth';

module.exports = (app, includes) => {
  const render = includes.render;
  const json = {
    title: 'Home'
  };
  app.get(['/', '/home'], authModel.requireLoginWithRedirect, (req, res) => {
    render(req, res, 'app', json);
  });
};
