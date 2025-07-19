class POController {

  constructor() {
    this.apiURI = process.env.API_URI;
  }

  async index(req, res, next) {
    res.render('po/index',  { "apiURI": this.apiURI });
  }

  async polist(req, res, next) {
    res.render('po/list',  { "apiURI": this.apiURI });
  }

}

export default POController;
