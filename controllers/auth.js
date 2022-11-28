import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {validationResult} from "express-validator";

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        message: `Entered data is incorrect`,
      })
    }

    const {name, email, password} = req.body;

    const isUsed = await User.findOne({email});

    if(isUsed) {
      return res.json({
        message: 'Email is already used',
      })
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const blocked = false;
    const lastLoginDate = new Date();

    const newUser = new User({
      name,
      email,
      password: hash,
      blocked: blocked,
      lastLoginDate: lastLoginDate,
    })

    const token = jwt.sign({
      id: newUser._id,
    },
     process.env.JWT_SECRET,
    {expiresIn: '30d'},
    )

    await newUser.save()

    res.json({
      newUser,
      token,
      message: 'Registration is correct',
    })
  } catch(error) {
    res.json({message: 'Error creating account'})
  }
}

export const login = async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if (!user) {
      return res.json({
        message: 'Email isn`t correct.'
      })    
    }

    if (user.blocked) {
      return res.json({
        message: 'User is blocked.'
      })    
    }

    user.lastLoginDate = new Date();

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if(!isPasswordCorrect) {
      return res.json({
        message: 'Password isn`t correct.'
      })
    }

    const token = jwt.sign({
      id: user._id,
    },
     process.env.JWT_SECRET,
    {expiresIn: '30d'},
    )

    await user.save()

    res.json({
      token,
      user,
      message: 'You are in system'
    })    

  } catch(error) {
    res.json({message: 'Authorization error'})
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.json({
        message: 'User isn`t correct'
      })    
    }

    const token = jwt.sign({
      id: user._id,
    },
     process.env.JWT_SECRET,
    {expiresIn: '30d'},
    )

    res.json({
      user, token,
    })

  } catch(error) {
    res.json({message: 'Access error'})
  }
}