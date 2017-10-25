import { Router } from 'express';
import cors from 'cors';
import brightcoveController from './controllers/brightcoveController';

const router = Router();

router.use(cors());

router.get('/', (req, res) => {
    res.statusCode(200);
    res.send('VIDEO_SERVICE');
});

router.use('/video', brightcoveController);
router.use(function (err, req, res, next) {
    res.status(err.statusCode || 500).json(err);
});
export default router;
