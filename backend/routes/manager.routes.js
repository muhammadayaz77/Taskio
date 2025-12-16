
import express from 'express';
const router = express.Router();

import { createDeveloper, deleteDeveloper, getAllDevelopers, getFreeDevelopers, login, logoutManager, registerManager, updateDeveloper } from '../controller/manager.controller.js';
import { Auth } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/manager.middleware.js';

router.post("/register" , registerManager)
router.post("/login"  , login)
router.post("/create/developer"  , Auth , isAdmin , createDeveloper)
router.get('/developers', Auth , isAdmin , getAllDevelopers);
router.get('/free/developer', Auth , isAdmin , getFreeDevelopers);
router.put('/developer/:id', Auth , isAdmin , updateDeveloper);
router.delete('/developer/:id', Auth , isAdmin , deleteDeveloper);
router.post("/logout" , Auth , isAdmin , logoutManager)
export default router;
