import Server from '@bxm/microservice';
import routes from './routes';
import version from '../version';
import config from '../serverConfig';
import logger from '../logger';

export default function () {
    const server = new Server({
        name: 'VIDEO_SERVICE',
        version: { buildNumber: version },
        docs: './docs/api.raml',
        routes,
        config,
        logger
    });

    server.start();
    return server;
}

