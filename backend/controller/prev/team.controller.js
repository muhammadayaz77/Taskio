import Team from '../models/team.model.js';


// creating a team 
export const createTeam = async (req, res) => {
  try {
    const { name } = req.body;
    const managerId = req.user._id;
    const team = await Team.create({ name  , managerId});
    res.status(201).json({ message: 'Team created successfully', team });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


// add developer to a team 
export const addDeveloperToTeam = async (req, res) => {
  try {
    const { teamId, developerId } = req.body;
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

      if (!team || team.managerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied. Task does not belong to you.' });
    }

    if (!team.developers.includes(developerId)) {
      team.developers.push(developerId);
      await team.save();
    }

    res.status(200).json({ message: 'Developer added to team', team });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};



// remove developer from the team 
export const removeDeveloperFromTeam = async (req, res) => {
  try {
    const { teamId, developerId } = req.body;
    const team = await Team.findById(teamId);
      if (!team || team.managerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied. Task does not belong to you.' });
    }
    if (!team) return res.status(404).json({ message: 'Team not found' });

    team.developers = team.developers.filter(id => id.toString() !== developerId);
    await team.save();

    res.status(200).json({ message: 'Developer removed from team', team });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// get all teams
export const getAllTeams = async (req, res) => {
  try {
     const managerId = req.user._id
    const teams = await Team.find({managerId}).populate('developers', 'name email specialization');
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


// single team 
export const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('developers', 'name email specialization');
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};