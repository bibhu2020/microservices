class AssignmentController {
  async listAlerts(req, res) {
    // Sample data
    const jsonData = {
      assignments: [
      { id:1, name: "Finish Project", complete: false, tag: 'math'},
      { id:2, name: "Read Chapter 4", complete: true, tag: 'science'},
      { id:3, name: "Turn in homework", complete: false, tag: 'math'},
      { id:3, name: "Shekspear literature", complete: false, tag: 'english'},
      { id:3, name: "Calculus advanced", complete: false, tag: 'math'},
      { id:3, name: "Human reproductive system", complete: false, tag: 'science'},
      ],
    };

    // Set HTTP status code and Content-Type header
    res.status(200).set('Content-Type', 'application/json');

    // Send JSON response
    res.json(jsonData);
  }
}

export default AssignmentController;
