const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { NewUser } = require('../config/db');

const signup = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {

    const existingUser = await NewUser.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send({ msg: 'Email already registered' });
    }



    await NewUser.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(200).send({ msg: 'User registered' });
  } catch (err) {
    // console.error('Error during signup:', err);
    res.status(500).send({ msg: 'Error signing up' });
  }
};




const login = async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await NewUser.findOne({ where: { email } });
    if (!user) return res.status(401).send({ msg: 'Invalid Credentials' });


    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) return res.status(401).send({ msg: 'Invalid Credentials' });


    // const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.status(200).send({ msg: "Login successful", data: { user, token } });
  } catch (err) {
    // console.error('Error during login:', err);
    res.status(500).send({ msg: 'Error logging in' });
  }
};



const getuser = async (req, res) => {
  const id = req.user.id;
  console.log('id : ', id);

  try {

    const user = await NewUser.findOne({ where: { id } });
    if (!user) {
      return res.status(401).send({ msg: 'Invalid userid' });
    }
    else {

      let name = user.username;
      let email = user.email;
      res.status(200).send({ success: true, data: { name, email } });
    }

  } catch (err) {
    // console.error('Error during login:', err);
    res.status(500).send({ msg: 'invalid! something went wrong' });
  }
};




module.exports = {
  signup,
  login,
  getuser
};
