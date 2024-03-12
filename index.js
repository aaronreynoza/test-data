const mysql = require('mysql');
const fs = require('fs');
const stringify = require('csv-stringify');

const connection = mysql.createConnection({
  host: 'demodatabase.c9iggaio00lb.eu-west-2.rds.amazonaws.com',
  user: 'demoUsername',
  password: 'demoPassword',
  database: 'ExampleDB'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');

  const createTableSql = `CREATE TABLE IF NOT EXISTS Customer (
    CustID INT PRIMARY KEY,
    Name VARCHAR(255)
  )`;
  connection.query(createTableSql, (err, result) => {
    if (err) throw err;
    console.log('Table created');

    const insertSql = `INSERT INTO Customer (CustID, Name) VALUES (?, ?)`;
    const randomId = Math.floor(Math.random() * 1000) + 1;
    const randomName = `Customer${randomId}`;
    connection.query(insertSql, [randomId, randomName], (err, result) => {
      if (err) throw err;
      console.log('Record inserted');

      const selectSql = 'SELECT * FROM Customer';
      connection.query(selectSql, (err, rows) => {
        if (err) throw err;

        let mdContent = '# Customer Data\n\n';
        // Add table headers
        mdContent += '| CustID | Name |\n';
        mdContent += '|--------|------|\n';
        rows.forEach((row) => {
          mdContent += `| ${row.CustID} | ${row.Name} |\n`;
        });

        fs.writeFile('README.md', mdContent, (err) => {
          if (err) throw err;
          console.log('The file has been saved!');
        });

        connection.end();
      });
    });
  });
});
