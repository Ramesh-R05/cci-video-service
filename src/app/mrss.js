import RSS from '@bxm/rss-builder';
import mime from 'mime';

function createChannelData(req) {
    const { protocol, originalUrl } = req;
    const hostname = req.get('host');

    return {
        title: 'MRSS',
        feed_url: `${protocol}://${hostname}${originalUrl}`,
        site_url: `${protocol}://${hostname}${originalUrl}`,
        description: '',
        language: 'en-us',
        copyright: `${(new Date()).getFullYear()} BAUER MEDIA PTY LIMITED`,
        ttl: 60,
        generator: `${protocol}://${hostname}`,
        custom_namespaces: {
            dc: 'http://purl.org/dc/terms',
            media: 'http://search.yahoo.com/mrss/',
            mi: 'http://schemas.ingestion.microsoft.com/common/'
        }
    };
}


function getMimeType(src) {
    if (src.indexOf('?') > 0) return mime.getType(src.split('?')[0]);
    return mime.getType(src);
}

function createItemData(item) {
    const videoSrc = `http://players.brightcove.net/${item.account_id}/default_default/index.html?videoId=${item.id}`;
    const publisher = item.custom_fields.contentprovider || 'Bauer Media Pty Ltd';
    const category = item.custom_fields.brand;
    const title = item.name;
    const description = item.description || title;
    const pulishDate = item.published_at;
    const updateDate = item.updated_at;
    const keyWords = item.tags && item.tags.length > 0 ? item.tags.join(',') : '';
    const licensorName = 'BAUER MEDIA PTY LIMITED';
    const thumbnail = [
        {
            src: item.images.thumbnail.sources[0].src,
            width: item.images.thumbnail.sources[0].width,
            height: item.images.thumbnail.sources[0].height,
            type: getMimeType(item.images.thumbnail.sources[0].src)
        }
    ]

    return {
        title: title,
        description: description,
        guid: `video${item.id}`,
        custom_elements: [
            { 'pubDate': item.published_at },
            { 'author': publisher },
            {
                'media:content': [
                    {
                        _attr: {
                            url: videoSrc,
                            duration: item.duration,
                            type: getMimeType(item.original_filename)
                        }
                    },
                    {
                        'media:player': {
                            _attr: {
                                url: videoSrc
                            }
                        }
                    },
                    { 
                        'media:thumbnail': {
                             _attr: {
                                url: thumbnail[0].src,
                                type: thumbnail[0].type,
                                width: thumbnail[0].width,
                                height: thumbnail[0].height
                            }
                        }   
                    },
                    { 'media:title': title },
                    { 'media:text': description },
                    { 'media:copyright': publisher }
                ]
            },
            { 'lastBuildDate': updateDate },
            { 'mi:duration': item.duration },
            { 'mi:licensorName': licensorName },
            { 'media:category': category },
            { 'media:keywords': keyWords }
        ],
    };
}

function mrss(req) {
    const jsonVideos = req.videos;
    const feed = new RSS(createChannelData(req));
    const items = jsonVideos.map(item => createItemData(item));
    items.forEach(item => feed.item(item));
    return feed;
}



export default mrss;