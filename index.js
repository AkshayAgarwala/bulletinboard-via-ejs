var pg = require('pg');
var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var connectionString = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard';

app.get('/board', function(req, res){
  pg.connect(connectionString, function(err, client, done){
    client.query('select * from messages', function(err, result){
      res.render('board', {data: result.rows});
      done();
      pg.end();
    })
  })
})

app.get('/messages', function(req, res){
  pg.connect(connectionString, function(err, client, done){
    client.query(`select * from messages`, function(err, result){
          res.render('home', {messages: result.rows});
          done();
          pg.end();
    })
  })
})

app.get('/messages/:id', function(req, res){
  pg.connect(connectionString, function(err, client, done){
    var message_id = req.params.id;
    client.query(`select * from messages where id = '${message_id}'`, function(err, result){
      res.render('bulletinboard', {message: result.rows[0]});
      done();
      pg.end();
    })
  })
})

app.post('/messages', function(req, res){
  pg.connect(connectionString, function(err, client, done){
    client.query(`insert into messages (title, body) values('${req.body.title}', '${req.body.message}')`, function(err, result){
      res.redirect('/messages');
      done();
      pg.end();
    })
  })
})


app.listen(3000, function(){
  console.log("Listening on port 3000...");
})
