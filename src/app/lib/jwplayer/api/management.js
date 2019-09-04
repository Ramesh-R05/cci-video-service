import crypto from 'crypto';
import config from '../config/config';
import logger from '../../../../logger';
import request from 'request';

const { baseManagementHost } = config;
const apiSignatureBuilder = (apiNonce, timeStamp, params = null) => {
    let apiSignatureFormat = `api_format=json&api_key=${config.key}` +
                             `&api_nonce=${apiNonce}&api_timestamp=${timeStamp}`;
    if (params) {
        let parameters = '';
        for (const [key, value] of Object.entries(params)) {
            parameters += `${key}=` + `${value}&`;
        }

        apiSignatureFormat = `${apiSignatureFormat}&${parameters.substring(0, parameters.length - 1)}`;
    }

    const result = {
        apiSig: crypto.createHash('sha1').update(`${apiSignatureFormat}${config.secret}`).digest('hex'),
        config
    };

    return result;
};

const apiEndPoint = (apiNonce, timeStamp, version = 'v1', mainClass = 'channels', subClass = 'list', format = 'json', params = null) => {
    let endPoint = `${baseManagementHost}/${version}/${mainClass}`;

    if (subClass) {
        endPoint = `${endPoint}/${subClass}`;
    }

    if (params) {
        let parameters = '';
        for (const [key, value] of Object.entries(params)) {
            parameters += `${key}=` + `${value}&`;
        }

        endPoint = `${endPoint}?${parameters}api_nonce=${apiNonce}` +
                      `&api_timestamp=${timeStamp}` +
                      `&api_format=${format}&api_signature=${apiSignatureBuilder(apiNonce, timeStamp, params).apiSig}` +
                      `&api_key=${config.key}`;
    } else {
        endPoint = `${endPoint}?api_nonce=${apiNonce}` +
                    `&api_timestamp=${timeStamp}` +
                      `&api_format=${format}&api_signature=${apiSignatureBuilder(apiNonce, timeStamp, params).apiSig}` +
                      `&api_key=${config.key}`;
    }

    return endPoint;
};

const getAllChannels = (apiNonce, timeStamp) => {
    const params = null;
    const url = apiEndPoint(apiNonce, timeStamp, 'v1', 'channels', 'list', 'json', params);
    const qs = {
        api_nonce: apiNonce,
        api_timestamp: timeStamp,
        api_format: 'json',
        api_signature: apiSignatureBuilder(apiNonce, timeStamp, params).apiSig,
        api_key: apiSignatureBuilder(apiNonce, timeStamp, params).config.key
    };

    return new Promise((resolve, reject) => {
        request.get({ url, qs, json: true }, (error, response, data) => {
            if (error) {
                logger.info(`JWPlayer management api ERROR: the end point: ${url} and error object: ${JSON.stringify(error)}`);
                reject(error);
            }
            resolve(data);
        });
    });
};

export default getAllChannels;
