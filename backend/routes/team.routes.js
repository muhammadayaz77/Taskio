import express from 'express';
import { addDeveloperToTeam, createTeam, getAllTeams, getTeamById, removeDeveloperFromTeam } from "../controller/team.controller.js";
import { Auth } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/manager.middleware.js";

const router = express.Router();

router.post('/create', Auth , isAdmin, createTeam);
router.put('/add/developer', Auth , isAdmin, addDeveloperToTeam);
router.put('/remove/developer',Auth , isAdmin, removeDeveloperFromTeam);
router.get('/get', Auth , isAdmin, getAllTeams);
router.get('/:id', Auth , isAdmin, getTeamById);

export default router;