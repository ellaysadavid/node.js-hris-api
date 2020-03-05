const mysql = require('mysql');

const express = require('express');
var app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.listen(3000, (err) => {
	if (!err) 
		console.log("Express server running at port no : 3000");
	else
		console.log("Port not running " + err);
});
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "hrmsdb",
    multipleStatements : true
});

// Create table - "localhost:3000/createemptable"
app.get('/createemptable', (req, res) => {
    var sql = 'CREATE TABLE Employees(EmpId int AUTO_INCREMENT, EmpName VARCHAR(100), DOB datetime, Mobile VARCHAR(10), Email VARCHAR(100), PRIMARY KEY(EmpId))';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Employees table created...');
    });
});

//Get Method
app.get('/employees', (req, res) => {
    db.query('SELECT * FROM EMPLOYEES', (err, rows) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    });
});

//Get a particular emp
app.get('/employees/:id', (req, res) => {
    db.query('SELECT * FROM EMPLOYEES WHERE EmpId = ?', [req.params.id], (err, rows) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    });
});

//Insert an employees
app.post('/employees', (req, res) => {
    let emp = req.body;
    var sql = "SET @EmpId = ?;SET @EmpName = ?;SET @DOB = ?; SET @Mobile = ?; SET @Email = ?; \
    CALL EmployeeInsUpd(@EmpId,@EmpName,@DOB, @Mobile, @Email);";
    db.query(sql, [emp.EmpId, emp.EmpName, emp.DOB, emp.Mobile, emp.Email], (err, rows, fields) => {
        if (!err)            
        rows.forEach(element => {
            if(element.constructor == Array)
            res.send('Inserted employee id : '+element[0].EmpId);
        });
        else
            console.log(err);
    });
});

//Update an employees
app.put('/employees', (req, res) => {
    let emp = req.body;
    var sql = "SET @EmpId = ?;SET @EmpName = ?;SET @DOB = ?; SET @Mobile = ?; SET @Email = ?; \
    CALL EmployeeInsUpd(@EmpID,@EmpName,@DOB, @Mobile, @Email);";
    db.query(sql, [emp.EmpId, emp.EmpName, emp.DOB, emp.Mobile, emp.Email], (err, rows, fields) => {
        if (!err)
            res.send('Updated successfully');
        else
            console.log(err);
    });
});

//Delete an Employee by Id
app.delete('/employees/:id', (req, res) => {
    var sSql = 'DELETE FROm EMPLOYEES WHERE EMPID=?';
    db.query(sSql, [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully.');
        else
            console.log(err);
    });
});