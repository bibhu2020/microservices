class AppModel {
  getData() {
    let msg = '';
    const app = "server";
    msg = `Your application ${app} is healthy.`;
    return msg;
  }
}

export default AppModel;
