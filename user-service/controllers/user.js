const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.createUser = async (req, res, next) => {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    const hashed = await bcrypt.hash(password, 12);
    const user = new User({ email, password: hashed, name });
    const result = await user.save();
    res.status(201).json({
        message: "user created successfully",
        user: result._id,
    });
};

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(404).json({ message: "Email not found" });
    }
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
        return res.status(401).json({ message: "Wrong email or password" });
    }
    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
    res.status(200).json({ message: "Logged in successfully", token });
};
