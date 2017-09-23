/**
 * Entry Point, and dependencies
 */

 const config = require('./config');
 const restify = require('restify');
 const mongoose = require('mongoose');
 const restifyPlugins = require('restify-plugins');

/**
 * Server creation
 */

const server = restify.createServer({
	name: config.name,
	version: config.version,
});

/**
 * Middleware
 */
server.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({ mapParams: true }));
server.use(restifyPlugins.fullResponse());

/**
 * Start Server, Connect to DB & Require routes
 */

 server.listen(config.port, ()=>{
 	// mongo params
 	mongoose.Promise = global.Promise;
 	mongoose.connect(config.db.uri, { useMongoClient: true });

 	const db = mongoose.connection;

 	db.on('error', (err)=>{
 		console.error(err);
 		process.exit(1);
 	});

 	db.once('open', ()=>{
 		require('./routes')(server);
 		console.log(`Server listening on port: ${config.port}`);
 	});

 });