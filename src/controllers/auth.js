// import { registerUser } from '../services/auth.js';

// export async function registerController(req, res) {
//   const payload = {
//     name: req.body.name,
//     email: req.body.email,
//     password: req.body.password,
//   };

//   const registeredUser = await registerUser(payload);

//   res.send({ status: 200, message: 'User registered', data: registeredUser });
// }
import { registerUser, loginUser } from '../services/auth.js';

export async function registerController(req, res) {
  const payload = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  const registeredUser = await registerUser(payload);

  res.status(201).send({
    status: 'success',
    message: 'Successfully registered a user!',
    data: {
      id: registeredUser._id,
      name: registeredUser.name,
      email: registeredUser.email,
      createdAt: registeredUser.createdAt,
    },
  });
}

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 400,
        message: 'Email and password are required',
      });
    }

    const user = await loginUser(email, password);

    res.status(200).send({
      status: 'success',
      message: 'Successfully logged in!',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
