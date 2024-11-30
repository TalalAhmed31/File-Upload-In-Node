const express = require('express');
const multer = require('multer');
const path = require('path')

const app = express()
const port = 3000

// upload files:

// 1: setup disk storage:
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, "/uploads")
  },
  filename: function(req, file, cb){
    cb(null, file.originalname)
  }
})
const upload = multer({storage: storage});

// Do error handling

app.use((err, req, res, next)=>{
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";

  // Log the error for debugging purpose for developers only
  console.log(err.stack)

  // Tell the client about the error on client side with a JSON Object containing error details
  res.status(err.statusCode).json({
    status: err.statusCode,
    message: err.message,
  })
})

// Serve the HTML Form for file upload
app.get('/', (req,res)=>{
  res.sendFile(path.join(__dirname, 'index.html'))
});

// Handle file upload

app.post('/upload', upload.single('file'), (req, res, next)=>{
  if (!req.file){
    return next(new Error("No file uploaded"))
  }
  const uploadedFile = req.file;
console.log("uploaded file:", uploadedFile);
res.send("file "+ uploadedFile.originalname+"uploaded!")
})

// Serve uploaded files using express.static middleware
app.use('/file', express.static("uploads"))

// Catch-all middleware for handling undefined routes/endpoints
app.all("*", (req, res, next) =>{
  const err = new Error(`Cannot find the URL ${req.originalUrl} in this application`);

    err.status = "Endpoint Failure";
    err.statusCode = 404;
    next(err)
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});