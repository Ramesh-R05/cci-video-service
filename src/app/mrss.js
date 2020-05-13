import RSS from '@bxm/rss-builder';
import mime from 'mime';

const createChannelData = (req) => {
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
            dc: 'http://purl.org/dc/elements/1.1/',
            dcterms: 'http://purl.org/dc/terms',
            media: 'http://search.yahoo.com/mrss/',
            mi: 'http://schemas.ingestion.microsoft.com/common/'
        }
    };
};


const getMimeType = (src) => {
    if (src && Array.isArray(src)) {
        if (src.indexOf('?') > 0) {
            return mime.getType(src.split('?')[0]);
        }
    }
    return mime.getType(src);
};

const createItemData = (item) => {
    const {
        sources,
        brand,
        title,
        description,
        contentprovider,
        updatedAt,
        tags,
        image,
        pubdate,
        brightcoveid,
        mediaid,
        duration
    } = item;

    const videoSource = sources.filter(source => source.label === '180p');
    const videoSrc = videoSource[0].file;
    const publisher = contentprovider || 'Bauer Media Pty Ltd';
    const category = brand;
    const itemTitle = title;
    const itemDescription = description || itemTitle;
    const guid = brightcoveid || mediaid;
    const updateDate = updatedAt || pubdate;
    const keyWords = tags || '';
    const licensorName = 'BAUER MEDIA PTY LIMITED';
    const thumbnail = [
        {
            src: image,
            width: 320,
            height: 180,
            type: getMimeType(image)
        }
    ];

    return {
        itemTitle,
        itemDescription,
        guid: `video${guid}`,
        custom_elements: [
            { pubDate: pubdate },
            { author: publisher },
            {
                'media:content': [
                    {
                        _attr: {
                            url: videoSrc,
                            duration,
                            type: getMimeType(videoSrc)
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
                    { 'media:title': itemTitle },
                    { 'media:text': itemDescription },
                    { 'media:copyright': publisher }
                ]
            },
            { lastBuildDate: updateDate },
            { 'mi:duration': duration },
            { 'mi:licensorName': licensorName },
            { 'media:category': category },
            { 'media:keywords': keyWords }
        ]
    };
};

const mrss = (req) => {
    const jsonVideos = req.videos;
    const feed = new RSS(createChannelData(req));

    if (jsonVideos && Array.isArray(jsonVideos.playlist)) {
        const items = jsonVideos.playlist.map(item => createItemData(item));
        items.forEach(item => feed.item(item));
    }

    return feed;
};

export default mrss;
