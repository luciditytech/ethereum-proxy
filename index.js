require('dotenv').config();

const app = require('./src/app.js').default;

const port = process.env.PORT || 3000;

app.listen(port, (err) => {
  if (!err) {
    console.log(`Server is running on port: ${port}`);
  }
});

