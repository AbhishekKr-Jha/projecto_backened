const mongoose = require("mongoose");

// mongoose
//   .connect("mongodb://localhost:27017/PROJECTO", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("CONNECTTION_SUCCESSFUL");
//   })
//   .catch((err) => {
//     console.log("TERMINATED DUE TO__", err);
//   });
mongoose  
  .connect(
   process.env.CONNECTION_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("CONNECTTION_SUCCESSFUL");
  })
  .catch((err) => {
    console.log("TERMINATED DUE TO__", err);
  });

