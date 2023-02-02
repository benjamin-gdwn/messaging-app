const { connect } = require("getstream");
const bcrypt = require("bcrypt");
const StreamChat = require("stream-chat").StreamChat;
const crypto = require("crypto");

require("dotenv").config();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

const signup = async (req, res) => {
  try {
    const { fullName, username, password, phoneNumber } = req.body;

    const userId = crypto.randomBytes(16).toString("hex");

    const serverClient = connect(api_key, api_secret, app_id);

    const hashedPassword = await bcrypt.hash(password, 10);

    const token = serverClient.createUserToken(userId);
    console.log(serverClient);

    res
      .status(200)
      // sending the data to the front end from back end
      .json({ token, fullName, username, userId, hashedPassword, phoneNumber });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: error });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    

    const serverClient = connect(api_key, api_secret, app_id);
    
    const client = StreamChat.getInstance(api_key, api_secret);
    // use this to query the users front the database and only use the name which matc hes username
    const { users } = await client.queryUsers({ name: username });

    if (!users.length)
    // if theres no users found we return this message
      return res.status(400).json({ message: "User not found" });
    // if there is a user found compare the password to hashed password
    const success = await bcrypt.compare(password, users[0].hashedPassword);
    // create a new user token
    const token = serverClient.createUserToken(users[0].id);

    if (success) {
      // send all the data back to the back end
      res
        .status(200)
        .json({
          token,
          fullName: users[0].fullName,
          username,
          userId: users[0].id,
        });
    } else {
      // if we fail to match passwords send the message
      res.status(500).json({ message: "Incorrect password" });
    }
  } catch (error) {
    ads;
    console.log(error);

    res.status(500).json({ message: error });
  }
};

module.exports = { signup, login };
