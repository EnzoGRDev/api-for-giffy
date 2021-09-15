const app = require('./app');

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server listen on port ${PORT}`));