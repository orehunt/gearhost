var express = require('express');
var app = express();
var port = process.env.PORT || '3000';
var sps = require('child_process').spawn;
var stringArgv = require('string-argv');

app.get('/', function(req, res){
	//res.send('id: ' + req.query.id);
	if ( typeof req.query.run !== 'undefined' && req.query.run  ) {
		cargs = stringArgv.parseArgsStringToArgv(req.query.run);
		console.log(cargs)
		try {   
			proc = sps(cargs[0], cargs.slice(1), {
				shell: true
			});
			proc.stdout.pipe(res)
			proc.stderr.pipe(res)
		}catch(err){
			res.send('error: '+err)
		}
	} else {
		res.send('')
	}
});

app.use(express.static('.'));

app.listen(port, function() {
	console.log('Listening on port ' + this.address().port);
});

//var fs = require('fs');
////var spawn = require('child_process').spawn;
//var crypto = require('crypto');
//var inspect = require('util').inspect;
//var buffersEqual = require('buffer-equal-constant-time');
//var ssh2 = require('ssh2');
//var utils = ssh2.utils;
////var stringArgv = require('string-argv');
//var isWin = /^win/.test(process.platform);
//
//var pubKey = utils.genPublicKey(utils.parseKey(fs.readFileSync('ssh2/user.pub')));
//
//new ssh2.Server({
//  hostKeys: [fs.readFileSync('ssh2/host.key')]
//}, function(client) {
//  console.log('Client connected!');
//	var procs = [];
//  client.on('authentication', function(ctx) {
//    if (ctx.method === 'password'
//        // Note: Don't do this in production code, see
//        // https://www.brendanlong.com/timing-attacks-and-usernames.html
//        // In node v6.0.0+, you can use `crypto.timingSafeEqual()` to safely
//        // compare two values.
//        && ctx.username === 'foo'
//        && ctx.password === 'bar')
//      ctx.accept();
//    else if (ctx.method === 'publickey'
//             && ctx.key.algo === pubKey.fulltype
//             && buffersEqual(ctx.key.data, pubKey.public)) {
//      if (ctx.signature) {
//        var verifier = crypto.createVerify(ctx.sigAlgo);
//        verifier.update(ctx.blob);
//        if (verifier.verify(pubKey.publicOrig, ctx.signature))
//          ctx.accept();
//        else
//          ctx.reject();
//      } else {
//        // if no signature present, that means the client is just checking
//        // the validity of the given public key
//        ctx.accept();
//      }
//    } else
//      ctx.reject();
//  }).on('ready', function() {
//	  console.log('Client authenticated!');
//	  client.on('session', function(accept, reject) {
//		  var session = accept();
//		  session.on('pty', function(accept, reject, info){
//			  accept();
//		  });
//		  session.on('exec', function(accept, reject, info) {
//			  var stream = accept();
//			  var proc;
//			  cargs = stringArgv.parseArgsStringToArgv(info.command);
//			  // node versions pre-v5 do not have the `shell` option, so do it manually
//			  if (! isWin ) {
//				  if (/^v[0-4]\./.test(process.version))
//					  proc = spawn('/bin/sh', [ '-c', info.command ]);
//				  else
//					  proc = spawn(cargs[0], cargs.slice(1), { shell: true});
//			  } else {
//					  proc = spawn('C:\local\Temp\cygwin\bin\bash.exe', cargs);
//			  }
//
//			  procs.push(proc);
//
//			  stream.stdin.pipe(proc.stdin);
//			  proc.stdout.pipe(stream.stdout);
//			  proc.stderr.pipe(stream.stderr);
//
//			  proc.on('exit', function(code, signal) {
//				  stream.writable && stream.exit(typeof code === 'number' ? code : signal);
//			  }).on('close', function() {
//				  stream.writable && stream.end();
//				  var idx = procs.indexOf(proc);
//				  if (idx !== -1)
//					  procs.splice(idx, 1);
//			  });
//		  });
//	  });
//  }).on('end', function() {
//	  console.log('Client disconnected');
//	  // cleanup any spawned processes that may still be open
//	  for (var i = 0; i < procs.length; ++i)
//		  procs[i].kill('SIGKILL');
//	  procs.length = 0;
//  });
//}).listen(12346, '127.0.0.1', function() {
//	console.log('Listening on port ' + this.address().port);
//});
//
//
