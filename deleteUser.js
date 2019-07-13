const axios = require("axios");
const createToken = require("./createToken");

const id = process.argv[2];

(async () => {
  const tokenRes = await createToken(`users ${id} delete_user`);
  const res = await axios.request({
    url: `http://localhost:3000/api/v1/users/${id}`,
    method: "delete",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${tokenRes.accessToken}`
    }
  })
  console.log(res.data);
  console.log("--------------------------");
})()