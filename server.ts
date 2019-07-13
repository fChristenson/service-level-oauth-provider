import { app } from "./src/app";

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Running on port", port);
  console.log('--------------------------');
});
