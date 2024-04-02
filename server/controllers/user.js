const UserModel = require("../models/UserModel");

const getUser = async (req, res) => {
  try {
    const { id } = req.body;
    console.log(req.body);

    console.log(id);
    const user = await UserModel.findById(id);
    if (!user) return res.status(404).json("User not found");
    res.status(200).json({ message: "Success", user });
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { getUser };
