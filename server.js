var fs = require('fs');
var inspect = require('util').inspect;
var spawn = require('child_process').spawn;

var ssh2 = require('ssh2');

new ssh2.Server({
  hostKeys: [
    fs.readFileSync('host.key'),
  ]
}, function(client) {
  console.log('Client connected!');
  var procs = [];

  client.on('authentication', function(ctx) {
    ctx.accept();
  }).on('ready', function() {
    console.log('Client authenticated!');

    client.on('session', function(accept, reject) {
      var session = accept();
	    session.on('pty', function(accept, reject){
		    accept();
	    });
      session.on('exec', function(accept, reject, info) {
        var stream = accept();
        var proc;
        // node versions pre-v5 do not have the `shell` option, so do it manually
        if (/^v[0-4]\./.test(process.version))
          proc = spawn('/bin/sh', [ '-c', info.command ]);
        else
          proc = spawn(info.command, { shell: true });

        procs.push(proc);

        stream.stdin.pipe(proc.stdin);
        proc.stdout.pipe(stream.stdout);
        proc.stderr.pipe(stream.stderr);

        proc.on('exit', function(code, signal) {
          stream.writable && stream.exit(typeof code === 'number' ? code : signal);
        }).on('close', function() {
          stream.writable && stream.end();
          var idx = procs.indexOf(proc);
          if (idx !== -1)
            procs.splice(idx, 1);
        });
      });
    });
  }).on('end', function() {
    console.log('Client disconnected');
    // cleanup any spawned processes that may still be open
    for (var i = 0; i < procs.length; ++i)
      procs[i].kill('SIGKILL');
    procs.length = 0;
  });
}).listen(12346, '127.0.0.1', function() {
  console.log('Listening on port ' + this.address().port);
});
