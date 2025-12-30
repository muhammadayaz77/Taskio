

// creating a team 
export const login = async (req, res) => {
  try {
    // const { name } = req.body;
    // const managerId = req.user._id;
    // const team = await Team.create({ name  , managerId});
    res.status(201).json({ message: 'Team created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

