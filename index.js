const express = require("express");
const app = express();

app.disable("x-powered-by");

require("./projects/gdrawings/gdrawings")(app);

var port = process.env.PORT || 5000;
app.listen(port);
console.log("Listening on port " + port);
