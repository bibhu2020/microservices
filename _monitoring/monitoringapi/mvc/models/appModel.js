class AppModel {
  getData() {
    let msg = '';
    const app = process.env.APP_NAME || "server";
    const appStatus = parseInt(process.env.APP_STATUS);

    if (appStatus !== 200) {
        msg = `Your application ${app} is not healthy. Please contact your system administrator.`;
    } else {
        msg = `Your application ${app} is healthy.`;
    }

    return msg;
  }
}

export default AppModel;
