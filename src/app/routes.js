import { Router } from 'express';
import cors from 'cors';
import brightcoveMIddleware from './middlewares/brightcoveMIddleware';

const router = Router();

router.use(cors());

router.get('/', (req, res, next) => {
    res.statusCode(200);
    res.send('VIDEO_SERVICE');
});

router.get('/getPlayListById', brightcoveMIddleware.getPlayListById);

export default router;
