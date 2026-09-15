const express = require("express");
const cors = require("cors");

const solutionRoutes = require("./routes/solution-routes");
const environmentRoutes = require("./routes/environment-routes");
const deployRoutes = require("./routes/deployment-routes");
const validationRoutes = require("./routes/validation-routes");
const configRoutes = require("./routes/config-routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/solutions", solutionRoutes);
app.use("/api/environments", environmentRoutes);
app.use("/api/deployments", deployRoutes);
app.use("/api/validate", validationRoutes);
app.use("/api/config", configRoutes);

app.listen(3001, () => {
  console.log("PPALM API running on port 3001");
});
