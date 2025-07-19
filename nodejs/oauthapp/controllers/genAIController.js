class GenAIController {

  constructor() {
    this.genApiURL = process.env.GEN_API_URI;
    console.log('GenAIController: genApiURL = ' + this.genApiURL);
  }

  async translate(req, res, next) {
    res.render('genai/translate', { "genApiURL": this.genApiURL });
  }

  async chat(req, res, next) {
    res.render('genai/chat', { "genApiURL": this.genApiURL });
  }

  async loganalysis(req, res, next) {
    res.render('genai/loganalysis', { "genApiURL": this.genApiURL });
  }

}

export default GenAIController;
