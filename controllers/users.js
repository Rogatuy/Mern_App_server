import User from "../models/User.js";

export const getAll = async (req,res) => {
  try {
    const allUsers = await User.find().sort('createdAt');

    res.json({allUsers});

  } catch (error) {
    res.json({message: 'Something wrong'});
  }
}

export const blocked = async (req,res) => {
  try {
    const {_id} = req.body;
    const user = await User.findOne({_id});
    if (!user) return res.json({message: 'There aren`t this user in system'});

    user.blocked = true;

    await user.save()

    const allUsers = await User.find().sort('createdAt');

    res.json({
      allUsers,
      user,
      message: 'User is blocked'
    })    

  } catch(error) {
    res.json({message: 'Something wrong'})
  }
}

export const unblocked = async (req,res) => {
  try {
    const {_id} = req.body;
    const user = await User.findOne({_id});
    if (!user) return res.json({message: 'There aren`t this user in system'});

    user.blocked = false;

    await user.save()

    const allUsers = await User.find().sort('createdAt');
    res.json({
      allUsers,
      user,
      message: 'User is unblocked'
    })    

  } catch(error) {
    res.json({message: 'Something wrong'})
  }
}

export const removeUser = async (req,res) => {
  try {
    const {_id} = req.body;
    const user = await User.findOneAndDelete({_id});
    if (!user) return res.json({message: 'There aren`t this user in system'});

    const allUsers = await User.find().sort('createdAt');
    res.json({
      allUsers,
      user,
      message: 'User is delete'
    })   

  } catch(error) {
    res.json({message: 'Something wrong'})
  }
}

