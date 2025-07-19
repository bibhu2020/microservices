class DefenderController {
  async listAlerts(req, res) {
    // Sample data
    const jsonData = {
      message: "Hello, world!",
      data: {
        name: "John",
        age: 30
      }
    };

    // Set HTTP status code and Content-Type header
    res.status(200).set('Content-Type', 'application/json');

    // Send JSON response
    res.json(jsonData);
  }
}

export default DefenderController;
