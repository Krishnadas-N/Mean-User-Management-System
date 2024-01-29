const express = require('express');
const bodyParser = require('body-parser');
require('./Utils/DbConnection');
const morgan = require('morgan');
const app = express();
const cors = require('cors')

const adminRoute = require('./routes/adminRouter')
const userRoute= require('./routes/userRouter')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined'));

app.use(
  cors({
    credentials: true,
    origin: '*',
    optionsSuccessStatus: 200,
  })
);
app.use(morgan('dev'));

app.use('/api/admin',adminRoute);
app.use('/api/users',userRoute);

 

app.use((obj, req, res, next) => {
  console.log(obj)
  const statusCode = obj.status || 500;
  const errorMessage = obj.message || "Something went wrong";
  
  const jsonResponse = {
      success: [200, 201, 204].some(a => a === obj.status) ? true : false,
      status: statusCode,
      message: errorMessage
  };

  if (obj.data !== undefined) {
      jsonResponse.data = obj.data;
  }

  return res.status(statusCode).json(jsonResponse);
});



const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
