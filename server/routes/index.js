import express from 'express';
import member from './member';
import history from './history';

const router = express.Router();

router.use('/member', member);
router.use('/history', history);
export default router;
