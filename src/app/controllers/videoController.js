import logger from '../../logger';
import config from '../lib/jwplayer/config/config';
import mrss from '../mrss';
import { allPlaylistVideos, allBrandLatestVideos } from '../lib/jwplayer/api/delivery';

const { playlists } = config;
const brandIdMapKeys = Object.keys(playlists);
const brandIdMapValues = Object.values(playlists);

const errorWrapper = (err) => {
    const { statusCode, response } = err;
    return {
        statusCode,
        response
    };
};

const getAllBrandLatestVideos = (req, res, next) => {
    const params = { search: 'msn', recency: '7D', page_limit: 20 };

    allBrandLatestVideos(playlists, params).then((data) => {
        const allBrandPlaylists = data.map(item => JSON.parse(item));
        const allVideos = [];
        const jwpVideos = {};
        allBrandPlaylists.forEach(jsonVideo =>
            jsonVideo.playlist.forEach(item => allVideos.push(item)));
        jwpVideos.playlist = allVideos;
        req.videos = jwpVideos;
        next();
    }).catch((error) => {
        logger.info(`video-service: latestVideos ERROR: ${JSON.stringify(error)}`);
        res.send(JSON.stringify(error));
    });
};

const getAllPlaylistVideos = (req, res, next) => {
    const { brandOrId } = req.params;
    const brandIdMap = (brandIdMapKeys.indexOf(brandOrId) !== -1) || (brandIdMapValues.indexOf(brandOrId) !== -1);
    const params = { search: 'msn' };

    if (!brandIdMap) {
        return next(errorWrapper({ response: `Invalid parameter, should have one of ${brandIdMapKeys.join(', ')}`, statusCode: 400 }));
    }

    const playerListKey = playlists[brandOrId] || brandOrId;

    allPlaylistVideos(playerListKey, params).then((data) => {
        req.videos = JSON.parse(data);
        next();
    }).catch((error) => {
        logger.info(`video-service: getAllPlaylistVideos ERROR: ${JSON.stringify(error)}`);
        res.send(JSON.stringify(error));
    });
};


const mrssGenerator = (req, res) => {
    res.header('Cache-Control', 'public, max-age=60');
    res.set('Content-Type', 'text/xml');
    res.send(mrss(req).xml().replace(/[\u001f\u001e]/g, ''));
};

export { getAllPlaylistVideos, getAllBrandLatestVideos, mrssGenerator };
