import express from 'express';
import member from './member';

const router = express.Router();

router.use('/member', member);

export default router;