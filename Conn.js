const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/PROJECTO", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("CONNECTTION_SUCCESSFUL");
  })
  .catch((err) => {
    console.log("TERMINATED DUE TO__", err);
  });

// mongoose
//   .connect(
//     "mongodb+srv://abhishekhp935:OVIdtCoFuj8AiNDq@projecto.pz7xhmb.mongodb.net/Projecto?retryWrites=true&w=majority",
//     {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     }
//   )
//   .then(() => {
//     console.log("CONNECTTION_SUCCESSFUL");
//   })
//   .catch((err) => {
//     console.log("TERMINATED DUE TO__", err);
//   });
