var db = require('./db.js').then((dbFunctions)=>{
  db = dbFunctions;
});

var fingerprintjs = require('fingerprintjs2');

var express = require('express');
var app = express();

app.use(express.static('public'));
app.use('/script/fingerprint2.js', express.static('node_modules/fingerprintjs2/dist/fingerprint2.min.js'));

app.use(express.json());

app.post('/fingerprint', function(req, res){
  var data = req.body;

  if(data){
    if("username" in data && "fingerprint" in data){
      db.saveFingerprint({
        username: data.username,
        fingerprint: data.fingerprint
      }).then(()=> {
        res.status(200);
        res.end();
      }).catch(()=>{
        console.error("[*] Error saving fingerprint");
        res.status(500);
        res.end();
      })
    } else {
      res.status(400);
      res.end();
    }
  } else {
    res.status(400);
    res.end();
  }
});

app.get('/fingerprint/:fingerprint', function(req, res){
  var fingerprint = req.params.fingerprint;
  if(fingerprint){
    db.getFingerprint(fingerprint).then((fp)=>{
      res.end(JSON.stringify(fp.dataValues));
    }).catch((e)=>{
      console.error("[*] Error getting fingerprint");
      console.error(e);
      res.status(500);
      res.end()
    });

  } else {
    res.status(400);
    res.end()
  }
});

app.get('*', function(req, res){
  res.redirect('/');
})

var server = app.listen(8080, function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log("Listening at %s:%s", host, port);
});
