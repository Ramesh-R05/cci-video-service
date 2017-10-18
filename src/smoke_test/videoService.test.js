var nconf = require('nconf');
nconf.argv().env();
var baseUrl = nconf.get('URL');
var request = require('supertest');

const app = baseUrl;

console.log('running on url :: ' + baseUrl);


describe('my service', function() {
    it('returns VIDEO_SERVICE', function(done) {
        request(app)
            .get('/')
            .expect('VIDEO_SERVICE', done);
    });

});
