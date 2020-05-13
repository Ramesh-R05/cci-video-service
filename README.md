# video-service

## BaseUri: http://video-service.prod.bxm.net.au

## Related Reading:
 - https://developer.jwplayer.com

## Router:
### General Info
 - /docs
 - /version
### Get latest videos from all brands
 - /video/mrss
### Get latest videos by playlist id/brand, in following example: X1jFQP7R is elle's playlist's id
 - /video/playlist/MSN-NTL/mrss
 - /video/playlist/ca4ZfbXt/mrss

 ### JWPlayer management api nonce and timestamp config formats
 - const apiNonce = Math.floor(Math.random() * 89999999 + 100000);
 - const apiTimeStamp = Math.round((new Date()).getTime() / 1000);

 ### examples of how to use params/param formats in the following methods (dev note)
 - JW Player Delivery API
 - https://developer.jwplayer.com/jw-platform/docs/delivery-api-reference/#/Playlists/get_v2_playlists__playlist_id_
 - allBrandLatestVideos in delivery.js -> const params = { search: 'msn', recency: '7D', page_limit: 20 };

 - JW Player Management API
 - https://developer.jwplayer.com/jw-platform/reference/v1/methods/channels/list.html
 - getAllChannels in management.js -> const params = { order_by: 'title:asc', type_filter: 'search' };
