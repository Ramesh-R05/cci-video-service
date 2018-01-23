import server from '../app/server';
import bcConfig from '../config';
import tokenRes from './mocks/bcToken.json';
import wrongTokenRes from './mocks/wrongBcToken.json';
import videosListRes from './mocks/bcVideoList.json';
import parser from 'xml2json';

describe('Test server', function() {
    const bcApiRemote = 'https://oauth.brightcove.com';
    const cmsBaseApi = `https://cms.api.brightcove.com`;
    const base = 'http://localhost'
    const port = 3000;
    const path = "/video";
    let app;
    let baseUrl;

    before(() => {
        baseUrl = `${base}:${port}${path}`;
        app = server();
    });

    after(() => {
        app.stop();
    });

    it('can get all videos', function(done) {
        nock.cleanAll();

        nock(bcApiRemote)
        .post('/v4/access_token')
        .reply(200, tokenRes);

        nock("https://cms.api.brightcove.com")
        .get("/v1/accounts/761709621001/videos?sort=-updated_at")
        .reply(200, videosListRes)

        request('http://localhost:3000')
            .get('/video/mrss')
            .end(function(err, res) {
                const data = JSON.parse(parser.toJson(res.text));
                expect(data.rss["xmlns:dc"]).to.eq("http://purl.org/dc/terms");
                expect(data.rss["xmlns:media"]).to.eq("http://search.yahoo.com/mrss/");
                expect(data.rss["xmlns:mi"]).to.eq("http://schemas.ingestion.microsoft.com/common/");
                expect(data.rss["channel"]["title"]).to.eq("MRSS");
                expect(data.rss["channel"]["description"]).to.eq("MRSS");
                expect(data.rss["channel"]["copyright"]).to.contain("BAUER MEDIA PTY LIMITED");
                expect(data.rss["channel"]["item"].length).to.eq(2);
                expect(data.rss["channel"]["item"][0].title).to.eq("WD EXCLUSIVE: Kate & Stuart's airport reunion");
                expect(data.rss["channel"]["item"][1].title).to.eq("The Bachelorette: Lee wins Georgia Love's love, Matty J left speechless");
                expect(data.rss["channel"]["item"][0].pubDate).to.eq("2017-07-14T05:18:34.876Z");
                expect(data.rss["channel"]["item"][1].pubDate).to.eq("2016-10-27T22:41:05.157Z");
                expect(data.rss["channel"]["item"][0]["guid"]["$t"]).to.eq("video5507321994001");
                expect(data.rss["channel"]["item"][1]["guid"]["$t"]).to.eq("video5187860375001");
                expect(data.rss["channel"]["item"][0]["mi:duration"]).to.eq("39775");
                expect(data.rss["channel"]["item"][1]["mi:duration"]).to.eq("44927");
                expect(data.rss["channel"]["item"][0]["media:keywords"]).to.eq("stuart webb,mae,kate ritchie,wochit");
                expect(data.rss["channel"]["item"][1]["media:keywords"]).to.eq("love,bachelorette,inhouse,lee,matty j,georgia");
                expect(data.rss["channel"]["item"][0]["media:content"]["media:thumbnail"]["url"]).to.eq("http://brightcove04.o.brightcove.com/761709621001/761709621001_5507328956001_5507321994001-th.jpg?pubId=761709621001&videoId=5507321994001");
                expect(data.rss["channel"]["item"][1]["media:content"]["media:thumbnail"]["url"]).to.eq("http://brightcove04.o.brightcove.com/761709621001/761709621001_5187865679001_5187860375001-th.jpg?pubId=761709621001&videoId=5187860375001");
                done();
            })
    });

    it('can get videos by playlist id', function(done) {
        nock.cleanAll();

        nock(bcApiRemote)
        .post('/v4/access_token')
        .reply(200, tokenRes);

        nock("https://cms.api.brightcove.com")
        .get("/v1/accounts/761709621001/playlists/4631348873001/videos?sort=-updated_at")
        .reply(200, videosListRes)

        request('http://localhost:3000')
            .get('/video/playlists/elle/mrss')
            .end(function(err, res) {
                const data = JSON.parse(parser.toJson(res.text));
                expect(data.rss["xmlns:dc"]).to.eq("http://purl.org/dc/terms");
                expect(data.rss["xmlns:media"]).to.eq("http://search.yahoo.com/mrss/");
                expect(data.rss["xmlns:mi"]).to.eq("http://schemas.ingestion.microsoft.com/common/");
                expect(data.rss["channel"]["title"]).to.eq("MRSS");
                expect(data.rss["channel"]["description"]).to.eq("MRSS");
                expect(data.rss["channel"]["copyright"]).to.contain("BAUER MEDIA PTY LIMITED");
                expect(data.rss["channel"]["item"].length).to.eq(2);
                expect(data.rss["channel"]["item"][0].title).to.eq("WD EXCLUSIVE: Kate & Stuart's airport reunion");
                expect(data.rss["channel"]["item"][1].title).to.eq("The Bachelorette: Lee wins Georgia Love's love, Matty J left speechless");
                expect(data.rss["channel"]["item"][0].pubDate).to.eq("2017-07-14T05:18:34.876Z");
                expect(data.rss["channel"]["item"][1].pubDate).to.eq("2016-10-27T22:41:05.157Z");
                expect(data.rss["channel"]["item"][0]["guid"]["$t"]).to.eq("video5507321994001");
                expect(data.rss["channel"]["item"][1]["guid"]["$t"]).to.eq("video5187860375001");
                expect(data.rss["channel"]["item"][0]["mi:duration"]).to.eq("39775");
                expect(data.rss["channel"]["item"][1]["mi:duration"]).to.eq("44927");
                expect(data.rss["channel"]["item"][0]["media:keywords"]).to.eq("stuart webb,mae,kate ritchie,wochit");
                expect(data.rss["channel"]["item"][1]["media:keywords"]).to.eq("love,bachelorette,inhouse,lee,matty j,georgia");
                expect(data.rss["channel"]["item"][0]["media:content"]["media:thumbnail"]["url"]).to.eq("http://brightcove04.o.brightcove.com/761709621001/761709621001_5507328956001_5507321994001-th.jpg?pubId=761709621001&videoId=5507321994001");
                expect(data.rss["channel"]["item"][1]["media:content"]["media:thumbnail"]["url"]).to.eq("http://brightcove04.o.brightcove.com/761709621001/761709621001_5187865679001_5187860375001-th.jpg?pubId=761709621001&videoId=5187860375001");
                done();
            })
    });

    it('if all works as normal, can get videos by folder name', function(done) {
        nock.cleanAll();

        nock(bcApiRemote)
        .post('/v4/access_token')
        .reply(200, tokenRes);

        nock("https://cms.api.brightcove.com")
        .get("/v1/accounts/761709621001/folders/597979723bfb3d7fa191c87a/videos?sort=-updated_at")
        .reply(200, videosListRes)

        request('http://localhost:3000')
            .get('/video/folders/food/mrss')
            .end(function(err, res) {
                const data = JSON.parse(parser.toJson(res.text));
                expect(data.rss["xmlns:dc"]).to.eq("http://purl.org/dc/terms");
                expect(data.rss["xmlns:media"]).to.eq("http://search.yahoo.com/mrss/");
                expect(data.rss["xmlns:mi"]).to.eq("http://schemas.ingestion.microsoft.com/common/");
                expect(data.rss["channel"]["title"]).to.eq("MRSS");
                expect(data.rss["channel"]["description"]).to.eq("MRSS");
                expect(data.rss["channel"]["copyright"]).to.contain("BAUER MEDIA PTY LIMITED");
                expect(data.rss["channel"]["item"].length).to.eq(2);
                expect(data.rss["channel"]["item"][0].title).to.eq("WD EXCLUSIVE: Kate & Stuart's airport reunion");
                expect(data.rss["channel"]["item"][1].title).to.eq("The Bachelorette: Lee wins Georgia Love's love, Matty J left speechless");
                expect(data.rss["channel"]["item"][0].pubDate).to.eq("2017-07-14T05:18:34.876Z");
                expect(data.rss["channel"]["item"][1].pubDate).to.eq("2016-10-27T22:41:05.157Z");
                expect(data.rss["channel"]["item"][0]["guid"]["$t"]).to.eq("video5507321994001");
                expect(data.rss["channel"]["item"][1]["guid"]["$t"]).to.eq("video5187860375001");
                expect(data.rss["channel"]["item"][0]["mi:duration"]).to.eq("39775");
                expect(data.rss["channel"]["item"][1]["mi:duration"]).to.eq("44927");
                expect(data.rss["channel"]["item"][0]["media:keywords"]).to.eq("stuart webb,mae,kate ritchie,wochit");
                expect(data.rss["channel"]["item"][1]["media:keywords"]).to.eq("love,bachelorette,inhouse,lee,matty j,georgia");
                expect(data.rss["channel"]["item"][0]["media:content"]["media:thumbnail"]["url"]).to.eq("http://brightcove04.o.brightcove.com/761709621001/761709621001_5507328956001_5507321994001-th.jpg?pubId=761709621001&videoId=5507321994001");
                expect(data.rss["channel"]["item"][1]["media:content"]["media:thumbnail"]["url"]).to.eq("http://brightcove04.o.brightcove.com/761709621001/761709621001_5187865679001_5187860375001-th.jpg?pubId=761709621001&videoId=5187860375001");
                done();
            })
    });

    it('if the token is not correct, should return error code 400', function(done) {
        nock.cleanAll();

        nock(bcApiRemote)
        .post('/v4/access_token')
        .reply(400, wrongTokenRes);

        nock("https://cms.api.brightcove.com")
        .get("/v1/accounts/761709621001/videos?sort=-updated_at")
        .reply(200, videosListRes)

        request('http://localhost:3000')
            .get('/video/mrss')
            .expect(400)
            .then(function(res) {
                expect(res.body.response.msg.body.error).to.eq("invalid_client");
                done();
            })
    })

    it('if the way to fetch video feeds is not supported, should return error code 400', function(done) {
        nock.cleanAll();

        nock(bcApiRemote)
        .post('/v4/access_token')
        .reply(200, tokenRes);

        nock("https://cms.api.brightcove.com")
        .get("/v1/accounts/761709621001/videos?sort=-updated_at")
        .reply(200, videosListRes)

        request('http://localhost:3000')
            .get('/video/not-supported/elle/mrss')
            .expect(400)
            .then(function(res) {
                expect(res.body.statusCode).to.eq(400);
                expect(res.body.response).to.eq('Unsupported parameter not-supported, should be one of playlists, folders');
                done();
            })
    })
});
