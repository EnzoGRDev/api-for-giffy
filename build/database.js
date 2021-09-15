const mongoose = require('mongoose');

const connectionString = 'mongodb+srv://EnzoDev:OHi9r2mclRdV3Iwf@cluster0.n6xox.mongodb.net/giffy-api?retryWrites=true&w=majority';
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Database conected")).catch(err => console.log(err));