# video-service

## BaseUri: http://video-service.prod.bxm.net.au

## Related Reading:
 - https://view.officeapps.live.com/op/view.aspx?src=https%3A%2F%2Fingestiontestcontent.blob.core.windows.net%2Fsamplefeedsdata%2FContent%20Specification.docx
 - http://feedexamples.ingestion.microsoft.com/video
 - https://support.brightcove.com/getting-access-tokens
 - https://brightcovelearning.github.io/Brightcove-API-References/cms-api/v1/doc/index.html#api-videoGroup-Get_Videos
 - https://brightcovelearning.github.io/Brightcove-API-References/cms-api/v1/doc/index.html#api-playlistGroup-Get_Videos_in_Playlist
 - https://brightcovelearning.github.io/Brightcove-API-References/cms-api/v1/doc/index.html#api-folderGroup-Get_Videos_in_Folder

## Router:
### General Info
 - /docs
 - /version
### Get latest videos
 - /video/mrss
### Get latest videos by playlist id/alias, in following example: elle is the alias of 4631348873001
 - /video/playlists/elle/mrss
 - /video/playlists/4631348873001/mrss
### Get latest videos by folder id/alias, in following example: food is the alias of 597979723bfb3d7fa191c87a
 - /video/folders/food/mrss
 - /video/folders/597979723bfb3d7fa191c87a/mrss

 ### How to add alias of playlist/folder id
    Please check `/src/config/default.json`, please do not change the entry name `playlists` or `folders` under `alias`, as its part of the endpoint.