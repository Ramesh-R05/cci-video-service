var nconf = require('nconf');
var parser = require('xml2json');
nconf.argv().env();
var baseUrl = nconf.get('URL');

const app = baseUrl;

console.log('running on url :: ' + baseUrl);


describe('my service', function() {
    it('returns VIDEO_SERVICE', function(done) {
        request(app)
            .get('/')
            .expect('VIDEO_SERVICE', done);
    });

    it('Get video feeds by playlist id', function(done) {
        request(app)
            .get('/video/playlists/4631348873001/mrss') // for playlist elle
            .expect(function(res) {
                const data = JSON.parse(parser.toJson(res.text));
                expect(data.rss["channel"]["item"].length > 1).to.eq(true);
            })
            .end(done);
    });

    it('Get video feeds by folder alias', function(done) {
        request(app)
            .get('/video/folders/food/mrss')
            .expect(function(res) {
                const data = JSON.parse(parser.toJson(res.text));
                expect(data.rss["channel"]["item"].length > 1).to.eq(true);
            })
            .end(done);
    });

});
