var hapi = require('hapi');
var mysql = require('mysql');

var quotes = [
  {
    author: 'Audrey Hepburn'
  , text: 'Nothing is impossible, the word itself says \'I\'m possible\'!'
  }
, {
    author: 'Walt Disney'
  , text: 'You may not realize it when it happens, but a kick in the teeth may be the best thing in the world for you'
  }
, {
    author: 'Unknown'
  , text: 'Even the greatest was once a beginner. Don\'t be afraid to take that first step.'
  }
, {
    author: 'Neale Donald Walsch'
  , text: 'You are afraid to die, and you\'re afraid to live. What a way to exist.'
},
     {
    author: 'Dhanaraj'
  , text: 'You are afraid to die, and you\'re afraid to live. What a way to exist.'
  }
];

// creating the hapi server instance
var server = new hapi.Server();

var connection = mysql.createConnection({
    host     : 'aa1nr1p0gstdyph.cb2hzdl82hkr.ap-southeast-2.rds.amazonaws.com',
    user     : 'root',
    password : 'Busybee123',
    database : 'nattamai'
});

// adding a new connection that can be listened on
server.connection({
  port: 8081,
  host: 'localhost',
  labels: ['web']
});

connection.connect();

 
server.register(require('vision'), function(err){

    if (err){
	throw err;
    }
    
// defining our routes
server.route({
  method: 'GET',
  path: '/',
    handler: function (request, reply) {
	connection.query('select id as priority, tablename as tables from nt_home', function(err, rows, fields){
	    if(err) throw err;
	    
	    
	    reply('Vanakkam Nattamai! Home Table name is '+ rows[0].tables);
	});
  }
});

server.route({
  method: 'GET'
, path: '/quotes'
, handler: function(req, reply) {
    reply(quotes);
  }
});


server.route({
  method: 'GET'
, path: '/random'
, handler: function(req, reply) {
    var id = Math.floor(Math.random() * quotes.length);
    reply(quotes[id]);
  }
});



server.route({
  method: 'GET'
, path: '/quote/{id?}'
, handler: function(req, reply) {
    if (req.params.id) {
	if (quotes.length <= encodeURIComponent(req.params.id)) {
        return reply('No quote found.').code(404);
      }
      return reply(quotes[req.params.id]);
    }
    reply(quotes);
  }
});



server.route({
  method: 'DELETE'
, path: '/quote/{id}'
, handler: function(req, reply) {
    if (quotes.length <= req.params.id) {
      return reply('No quote found.').code(404);
    }
    quotes.splice(req.params.id, 1);
    reply(true);
  }
});

});    
// starting the server
server.start(function (err) {
  if (err) {
    throw err;
  }
  
  console.log('hapi server started');
});
