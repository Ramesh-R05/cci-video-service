import base64 from 'base-64';
import { q } from "../help";
import querystring from "querystring";

const clientId = "5319c0e9-54a7-490d-9a24-897997d3175d";
const clientSecret = "Si0ff6_NzrPTD9t11B7YUxEiBFMhOS9kSGwTvYxQp0CUW0qsk3NI6RhZVsonmNb8x1VRFACY9HLz4mzD-GJXXQ";
const accId = "761709621001";
const cmsBaseApi = `https://cms.api.brightcove.com/v1/accounts/${accId}/`;

const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Authorization": `Basic ${base64.encode(`${clientId}:${clientSecret}`)}` 
}

const tokenOption = {
    method: 'POST',
    json: true,
    url: 'https://oauth.brightcove.com/v4/access_token',
    body: querystring.stringify({'grant_type': 'client_credentials'}),
    headers
}

function cmsReadBaseOption(token) {
    return {
        method: 'GET',
        json: true,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }
}

function findPlayListByIdOption(token, id) {
    return Object.assign({}, cmsReadBaseOption(token), {
        url: `${cmsBaseApi}playlists/${id}/videos`
    })
}

function token() {
    return q(tokenOption);
}

function getPlayListById(req, res, next) {
    const id = req.query.id;
    if(!id) next({msg:'no id specified'});

    token()
    .then(body => q(findPlayListByIdOption(body.body.access_token, id))
        .then(playListRes => res.send(playListRes.body))
        .catch(err => next(err))
    )
    .catch(err => next(err))
}

export default {
    getPlayListById: getPlayListById
}
