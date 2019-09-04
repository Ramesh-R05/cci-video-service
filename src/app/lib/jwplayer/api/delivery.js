import config from '../config/config';
import request from 'request';
import logger from '../../../../logger';

const { baseDeliveryHost } = config;
const apiEndPoint = (id, version = 'v2', mainClass = 'playlists', format = 'json', params = null) => {
    let endPoint = `${baseDeliveryHost}/${version}/${mainClass}/${id}?format=${format}`;

    if (params) {
        let parameters = '';
        for (const [key, value] of Object.entries(params)) {
            parameters += `${key}=` + `${value}&`;
        }

        endPoint = `${endPoint}&${parameters.substring(0, parameters.length - 1)}`;
    }

    return endPoint;
};

const allPlaylistVideos = (id, params) => {
    const endPoint = apiEndPoint(id, 'v2', 'playlists', 'json', params);
    return new Promise((resolve, reject) => {
        request.get(endPoint, (error, response, data) => {
            if (error) {
                logger.info(`JWPlayer gellAllPlaylistVideos ERROR: playlist id: ${id}
                the end point: ${endPoint} and error object: ${JSON.stringify(error)}`);
                reject(error);
            }
            resolve(data);
        });
    });
};

const allBrandLatestVideos = (playlists, params = null) => {
    const {
        ntl, htl, elle,
        hb, awwfood, bh, gt
    } = playlists;

    const ntlPlaylist = allPlaylistVideos(ntl, params);
    const htlPlaylist = allPlaylistVideos(htl, params);
    const ellePlaylist = allPlaylistVideos(elle, params);
    const hbPlaylist = allPlaylistVideos(hb, params);
    const awwfoodPlaylist = allPlaylistVideos(awwfood, params);
    const bhPlaylist = allPlaylistVideos(bh, params);
    const gtPlaylist = allPlaylistVideos(gt, params);

    return Promise.all([ntlPlaylist, htlPlaylist, ellePlaylist, hbPlaylist, awwfoodPlaylist, bhPlaylist, gtPlaylist]);
};

export { allPlaylistVideos, allBrandLatestVideos };
