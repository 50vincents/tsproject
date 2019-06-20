import express, { Application, Request, Response, NextFunction } from 'express';
import * as mysql from 'mysql';
import * as bodyParser from 'body-parser';

const app: Application = express();

// Allows access to req-body objects
app.use(bodyParser.urlencoded({ extended: true}));

// Use public folder with static html files
app.use(express.static('public'));

//app.set('view engine', 'ejs')

// Create MySQL DB connection + credentials
var db = mysql.createConnection({ 
  host: 'localhost',
  user: 'root',
  password: 'hasija22',
  database: 'UserDB'
});

// Connect to database
db.connect(function(err){
  if(err){
    console.log('can\'t connect');
    //throw err;
  } else{
    console.log('connected');
  }
  
  // Create database
  db.query('CREATE DATABASE if not exists UserDB', function(err: any, result: any){
    if(err){
      console.log('can\'t create db');
    } else{
      console.log('db created');
    }
    // Create schema
    let createTable: string = `CREATE TABLE if not exists Users(
      id INT,
      firstName VARCHAR(30),
      lastName VARCHAR(30),
      departmentName VARCHAR(30),
      managerName VARCHAR(30),
      dateOfBirth DATE,
      gender CHAR(1),
      status CHAR(1)
    )`;

    db.query(createTable, function(err: any, results: any, fields: any){
      if(err){
        console.log('can\'t create table');
      } else{
        console.log('created table');
      }
    });
  });
});

// CRUD RESTful API (Create, read, update, delete)

// Test data
//db.query('INSERT INTO Users(id) VALUES (5)'); 
//db.query()

// READ
app.get('/users', function(req: Request, res: Response){
  let queryString: string = 'SELECT * FROM Users'
  db.query(queryString, function(err: any, results: any, fields: any){
    if(err){
      console.log('error on read');
      //throw err;
    } else{
      res.send(results)
      //let message = `Users: ${results.firstName}`;
      //res.render('index', {dd: message, error: null});
    }
  });
});

// Query data by user ID
app.get('/users/:id', function(req: Request, res: Response){
  let queryString: string = 'SELECT * FROM Users WHERE id = ?'
  let queryData: number = req.params.id
  db.query(queryString, queryData, function(err: any, results: any, fields: any){
    if(err){
      console.log('error on read');
      //throw err;
    }
    res.send(results);
  });
});

// INSERT/CREATE
app.post('/users/:id/:dpt/:dob/:gen/:stat', function(req: Request, res: Response){
  let insertString: string = `INSERT INTO Users (id, departmentName, 
                                dateOfBirth, gender, status) VALUES (?, ?, ?, ?, ?)`

  let insertData: [number, string, Date, string, string]
  insertData = [req.params.id, req.params.dpt, req.params.dob, req.params.gen, req.params.stat]

  db.query(insertString, insertData, function(err: any, results: any, fields: any){
    if(err){
      console.log('error on insert');
      //console.log(req.body);
      //throw err;
    } else{
      console.log('Rows inserted: ', results.affectedRows);
      res.send(results)
    }
  });
});


// UPDATE
app.put('/users/:id/:man', function(req: Request, res: Response){
  let updateString: string = `UPDATE Users SET managerName = ? WHERE id = ?`;
  let updateData: [string, number] = [req.params.man.toString(), req.params.id]
  db.query(updateString, updateData, function(err, results, fields){
    if(err){
      console.log('error on update');
      //throw err;
    } else{
      console.log('Updated rows: ', results.affectedRows);
      res.send(results)
    }
  });
});

// DELETE
app.delete('/users/:id', function(req: Request, res: Response){
  let deleteString: string = 'DELETE FROM Users WHERE id = ?';
  let deleteData: number = req.params.id
  db.query(deleteString, deleteData, function(err: any, results: any, fields: any){
    if(err){
      console.log('error on delete');
      //throw err;
    } else{
      console.log('Deleted rows: '+ results.affectedRows);
      res.send(results);
    }
  });
});

// Creating server
app.listen(3000, function() {
  console.log('Server listening on port 3000');
});


