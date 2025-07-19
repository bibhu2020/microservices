import AksModel from '../models/aksModel.js'; // Import the getData function from the aksModel module
const model = new AksModel();

class AksController {
  async index(req, res) {
    const data = model.getData(); // Get data from model
    res.setHeader('Content-Type', 'text/html');
    res.status(200);
    res.render("aks/index", { data }); // Sends the request to the views location defined in app.js
  }
}

export default AksController;
