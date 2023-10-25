const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const con = require('./Config');

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
app.use(bodyParser.json());



app.get('/', (req, res) => {
    const sql = 'SELECT * FROM jobposting';
    con.query(sql, (error, results) => {
      if (error) {
        throw error;
      }
      res.json(results);
    });
  });

app.get('/DataList', (req, res) => {
    const sql = 'SELECT * FROM applicantsa';
    con.query(sql, (error, results) => {
      if (error) {
        throw error;
      }
      res.json(results);
    });
  });

  app.post('/JobPostingForm', (req, res) => {
    const newJobPosting = req.body;
    const sql = 'INSERT INTO jobposting (`Jobtitle`, `country`, `discription`, `Company`) VALUES (?, ?, ?, ?)';
    const values = [newJobPosting.Jobtitle,newJobPosting.country,newJobPosting.discription,newJobPosting.Company,];
  
    con.query(sql, values, (error, results) => {
      if (error) {
        console.error('Error inserting data into the MySQL table:', error);
        res.status(500).json({ message: 'Error submitting job posting' });
      } else {
        res.json({ message: 'Job posting submitted successfully' });
      }
    });
  });
  app.post('/ApplyForJob', upload.single('cv'), (req, res) => {
    // Get the form data from the request
    const jobData = [
      req.body.name,
      req.body.Jobtitle,
      req.body.Degree,
      req.body.email,
      req.file.path,
    ];
  
    // Insert the data into the MySQL database
    con.query(
      'INSERT INTO applicantsa (Name, JobTitle, Degree, email, Cv) VALUES (?, ?, ?, ?, ?)',
      jobData,
      (error, results) => {
        if (error) {
          console.error('Error submitting job posting:', error);
          res.status(500).json({ error: 'An error occurred while submitting the job posting' });
        } else {
          console.log('Job posting submitted successfully');
          res.status(200).json({ message: 'Job posting submitted successfully' });
        }
      }
    );
  });
  
  app.post('/login', (req, res) => {
    const sql = "SELECT * FROM register WHERE email = ?";
    const values =[
      req.body.email
    ]
    con.query(sql, [values], (err, data) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ Error: "Database Error" });
      }
      console.log(data)
      if (data.length > 0) {
        // Compare plain text passwords directly
        if (req.body.password === data[0].password) {
          // Password matched - show success alert
          return res.status(200).json({ Status: "Success" });
        } else {
          // Password not matched - show error alert
          return res.status(401).json({ Error: "Password Not Matched" });
        }
      } else {
        // User not found - show error alert
        return res.status(404).json({ Error: "User Not Found" });
      }
    });
  });
  
app.post('/Registration', (req, res) => {
    const sql = "INSERT INTO register (`name`, `email`, `password`) VALUES (?, ?, ?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password  // Store plain text password
    ];

    con.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ Error: "Error occurred while registering" });
        }
        // Registration successful
        return res.status(200).json({ status: "Success" });
    });
});

app.listen(8081, () => {
    console.log('Server is running on port 8081');
});
