import { use, expect } from 'chai';
import chaiHttp from 'chai-http';
import server from './SingletonWebServer.js'; // Import your Server class

// Initialize chai and use chai-http
const chai = use(chaiHttp);

class DefenderAPITests {
  constructor() {
    this.server = server;
  }

  runTests() {
    describe('API Tests', () => {
      before(() => {
        // Start the server before running the tests
        this.server.start();
      });

      it('should return 200 OK when accessing the API endpoint', (done) => {
        chai.request(this.server.server.app)
          .get('/api/defender')
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
      });

      it('should return JSON data when accessing the API endpoint', (done) => {
        chai.request(this.server.server.app)
          .get('/api/defender')
          .end((err, res) => {
            expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
            expect(res.body).to.be.an('object');
            done();
          });
      });

      it('should match JSON data when accessing the API endpoint', (done) => {
        chai.request(this.server.server.app)
          .get('/api/defender')
          .end((err, res) => {
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.have.property('name').that.is.a('string').and.equal('John');
            done();
          });
      });
    });
  }
}

// Usage
const apiTests = new DefenderAPITests();
apiTests.runTests();
