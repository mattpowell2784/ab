const express = require('express');
const UsersModel = require('../models/usersModel');
const jwt = require('jsonwebtoken');

const signToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signup = async (req, res, next) => {
  try {
    const newUser = await UsersModel.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(newUser._id);

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 100 * 60 * 60,
      //secure: true,
    });

    res.status(201).json({
      status: 'success',
      token: token,
      data: newUser,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

//---------------------------------------------------------------------

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //check if email and password exist
    if (!email || !password) {
      res.status(404).json({
        status: 'fail',
        message: 'Please provide email and password',
      });
    }

    // check if user exists and password is correct
    const user = await UsersModel.findOne({ email: email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      console.log('a');
      res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password',
      });
    }

    //if everythning ok, send token to cleint
    let token = signToken(user._id);

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      //secure: true,
    });

    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: err,
    });
  }
};

//---------------------------------------------------------------------

const protect = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log('a');
        console.log(err.message);
        res.redirect('/');
      } else {
        console.log('b');
        console.log(decodedToken);
        next();
      }
    });
  } else {
    console.log('c');
    res.redirect('/');
  }
};

//---------------------------------------------------------------------

const logout = async (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
};

module.exports = { signup, login, protect, logout };
