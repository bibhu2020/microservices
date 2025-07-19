class HomeController {
  async index(req, res, next) {
    const data = {
      message: "API Service is ready to serve.",
      httpCode: 200
    };

    // Render the HTML content
    res.status(200).json({
      status: 'success',
      data: data
    });

  }
}

export default HomeController;
