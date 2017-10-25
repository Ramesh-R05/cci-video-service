import base64 from 'base-64';
import config from '../../config';
import request from 'pro-request';
import querystring from 'querystring';
import { Router } from 'express';
import mrss from '../mrss';

const { alias, clientId, clientSecret, accId, tokenApi, cmsApi } = config;
const howToGetVideo = Object.keys(alias);
const bcRouter = Router();

const cmsBaseApi = `${cmsApi}/accounts/${accId}/`;

const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${base64.encode(`${clientId}:${clientSecret}`)}`
};

const tokenOption = {
    json: true,
    body: querystring.stringify({ grant_type: 'client_credentials' }),
    headers: { headers }
};

function createError(err) {
    const { statusCode, response } = err;
    return {
        statusCode,
        response
    }
}

function createRequestOptions(bcToken) {
    return {
        json: true,
        headers: {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${bcToken}`
            }
        }
    };
}

function getBrightcoveToken() {
    return request.post(tokenApi, tokenOption);
}

function getVideos(req, res, next) {
    const { searchId, getVideosBy } = req;
    const requestUrl = getVideosBy ? `${cmsBaseApi}${getVideosBy}/${searchId}/videos?sort=-updated_at` :
                                     `${cmsBaseApi}videos?sort=-updated_at`;

    getBrightcoveToken()
        .then(body => request.get(requestUrl, createRequestOptions(body.body.access_token))
            .then(videoRes => {
                req.videos = videoRes.body;
                next();
            })
            .catch(err => next(createError(err))))
        .catch(err => next(createError(err)));
}

function checkGetVideosBy(req, res, next, getVideosBy) {
    if (howToGetVideo.indexOf(getVideosBy) === -1) return next(createError({ response: `Unsupported parameter ${getVideosBy}, should be one of ${howToGetVideo.join(', ')}`, statusCode: 400 }));
    req.getVideosBy = getVideosBy;
    next();
}

function checkAliasOrId(req, res, next, aliasOrId) {
    if(!req.getVideosBy) return next(createError({ response: `Missing parameter, should have one of ${howToGetVideo.join(', ')}`, statusCode: 400 }));
    req.searchId = alias[req.getVideosBy][aliasOrId] || aliasOrId;
    next();
}

function genRss(req, res, next) {
    res.header('Cache-Control', 'public, max-age=60');
    res.set('Content-Type', 'text/xml');
    res.send(mrss(req).xml().replace(/[\u001f\u001e]/g, ''));
}

bcRouter.param('getVideosBy', checkGetVideosBy);
bcRouter.param('aliasOrId', checkAliasOrId);
bcRouter.get('/:getVideosBy/:aliasOrId/mrss', [getVideos, genRss]);
bcRouter.get('/mrss', [getVideos, genRss]);
export default bcRouter;
