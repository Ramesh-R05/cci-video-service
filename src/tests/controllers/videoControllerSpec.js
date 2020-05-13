import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../app/server';
chai.use(chaiHttp);
chai.should();

describe("videoController", () => {
    let app;

    before(() => {
        app = server();
    });

    after(() => {
        app.stop();
    });

    describe("Get all latest videos from all brands", () => {
        it("should get all latest videos from all brands", (done) => {
             chai.request('http://localhost:3000')
                 .get('/video/mrss')
                 .end((err, res) => {
                     res.should.have.status(200);
                     res.should.have.header('content-type', 'text/xml; charset=utf-8');
                     res.text.should.be.a('string');
                     res.text.should.contain('rss xml');
                     done();
                  });
         });
    });

    describe("Get all videos from elle brand by its brand name", () => {
        it("should get all videos from elle brand by its brand name", (done) => {
             chai.request('http://localhost:3000')
                 .get('/video/playlist/MSN-ELLE/mrss')
                 .end((err, res) => {
                     res.should.have.status(200);
                     res.should.have.header('content-type', 'text/xml; charset=utf-8');
                     res.text.should.be.a('string');
                     res.text.should.contain('rss xml');
                     done();
                  });
         });
    });

    describe("Get all videos from elle brand by its playlist id", () => {
        it("should get all videos from elle brand by its playlist id", (done) => {
             chai.request('http://localhost:3000')
                 .get('/video/playlist/ca4ZfbXt/mrss')
                 .end((err, res) => {
                     res.should.have.status(200);
                     res.should.have.header('content-type', 'text/xml; charset=utf-8');
                     res.text.should.equal(res.text);
                     res.text.should.contain('rss xml');
                     done();
                  });
         });
    });
});
