const axios = require("axios");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const privateKey = fs.readFileSync(path.join(__dirname, "./private.pem"));

const createToken = async (scope) => {
  const req = {
    clientId: "foo",
    scope,
  };
  const data = jwt.sign(req, privateKey, {algorithm: "RS256"});
  const res = await axios.get(`http://localhost:3000/api/v1/auth/token?claim=${data}`);
  console.log(res.data);
  console.log("--------------------------");
  return res.data;
};

module.exports = createToken;
