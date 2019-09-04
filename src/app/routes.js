import { Router } from 'express';
import cors from 'cors';
import { getAllPlaylistVideos, getAllBrandLatestVideos, mrssGenerator } from './controllers/videoController';

const router = Router();

router.use(cors());

router.get('/', (req, res) => {
    res.statusCode(200);
    res.send('VIDEO_SERVICE');
});

router.get('/video/playlist/:brandOrId/mrss', [getAllPlaylistVideos, mrssGenerator]);
router.get('/video/mrss', [getAllBrandLatestVideos, mrssGenerator]);

export default router;
