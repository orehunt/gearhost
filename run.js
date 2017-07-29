var fs = require('fs');
var crypto = require('crypto');
var inspect = require('util').inspect;

var buffersEqual = require('buffer-equal-constant-time');
var ssh2 = require('ssh2');
var utils = ssh2.utils;

var pubKey = utils.genPublicKey(utils.parseKey(fs.readFileSync('user.pub')));

new ssh2.Server({
  hostKeys: [fs.readFileSync('host.key')]
}, function(client) {
  console.log('Client connected!');

  client.on('authentication', function(ctx) {
    if (ctx.method === 'password'
        // Note: Don't do this in production code, see
        // https://www.brendanlong.com/timing-attacks-and-usernames.html
        // In node v6.0.0+, you can use `crypto.timingSafeEqual()` to safely
        // compare two values.
        && ctx.username === 'foo'
        && ctx.password === 'bar')
      ctx.accept();
    else if (ctx.method === 'publickey'
             && ctx.key.algo === pubKey.fulltype
             && buffersEqual(ctx.key.data, pubKey.public)) {
      if (ctx.signature) {
        var verifier = crypto.createVerify(ctx.sigAlgo);
        verifier.update(ctx.blob);
        if (verifier.verify(pubKey.publicOrig, ctx.signature))
          ctx.accept();
        else
          ctx.reject();
      } else {
        // if no signature present, that means the client is just checking
        // the validity of the given public key
        ctx.accept();
      }
    } else
      ctx.reject();
  }).on('ready', function() {
	  console.log('Client authenticated!');
	  client.on('session', function(accept, reject) {
		  var session = accept();
		  session.once('exec', function(accept, reject, info) {
			  var stream = accept();
			  stream.exit(0);
			  stream.end();
		  });
		  session.on('pty', function(accept, reject, info) {
			  accept();
		  });
		  session.on('shell', function(accept, reject) {
			  var stream = accept();
			  // Now read from and write to `stream`
		  });
	  });

  }).on('end', function() {
	  console.log('Client disconnected');
  });
}).listen(0, '127.0.0.1', function() {
	console.log('Listening on port ' + this.address().port);
});
