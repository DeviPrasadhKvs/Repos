let app = require("./../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;

chai.use(chaiHttp);

describe('Server', function() {
    it('test case for get_Profiles API', function(done) {
        chai.request('192.168.0.152:7000')
            .get('/getprofiles')
            .end(function(err, res) {
                // expect(res).to.have.status(200);
                // expect(res.body.status).to.equals("success");
                done();
            });
    })
})