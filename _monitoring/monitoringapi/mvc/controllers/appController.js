import AppModel from '../models/appModel.js'; // Import the getData function from the appModel module
const model = new AppModel();

class AppController {
  async index(req, res) {
    const data = model.getData(); // Get data from model
    res.setHeader('Content-Type', 'text/html');
    res.status(parseInt(process.env.APP_STATUS || 200));
    res.render("app/index", { data }); // Sends the request to the views location defined in app.js
  }
}

export default AppController;
