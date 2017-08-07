var http = require('http');
var net = require('net');
var dataBuff = [];
var sessions = [];

function attachOutboundListener(outboundTCP)
{
        outboundTCP.on('data', function(data) {
        for(var key in sessions)
        {
            if(sessions[key]=outboundTCP)
            {
             dataBuff[key]=data;
            }
        }
        });
}

function createOutboundTCP(res,req)
{
    var reqCookie=req.headers['cookie'];
    var HOST = req.headers['x-target'];
    var PORT = req.headers['x-port'];

    if(reqCookie==null)
    {
            var tcpConn = new net.Socket();

            tcpConn.connect(PORT,HOST);

            tcpConn.on( 'connect', function() {
                        var cookie='Ur'+Math.random();
                        sessions[cookie]=tcpConn;
                        attachOutboundListener(tcpConn);
                        res.writeHead(200,{'Set-Cookie':cookie,'X-STATUS':'OK'});
                        res.end();
            });

            tcpConn.on('error', function(error){
               console.log("Error creating new Outbound: "+error.message);
               res.writeHead(200,{'X-STATUS':'FAIL','X-ERROR':error.message});
               res.end();
            });
    }
    else if(reqCookie!=null&&sessions[reqCookie]==null)
    {
            var tcpConn = new net.Socket();
            tcpConn.connect(PORT,HOST);

            tcpConn.on( 'connect', function() {
                      sessions[reqCookie]=tcpConn;
                      attachOutboundListener(tcpConn);
                      res.writeHead(200,{'X-STATUS':'OK'});
                      res.end();
            });

            tcpConn.on('error', function(error){
                      console.log("Error creating new Outbound: "+error.message);
                      res.writeHead(200,{'X-STATUS':'FAIL','X-ERROR':error.message});
                      res.end();
            });
    }
    else
    {
        res.writeHead(200,{'X-STATUS':'OK'});
        res.end();
    }
}

function readOutboundTCP(res,req)
{
    var reqCookie=req.headers['cookie'];

    if(reqCookie!=null)
    {
        var currData=dataBuff[reqCookie];
        dataBuff[reqCookie]=null;

        if(currData!=null)
        {
                res.writeHead(200,{'X-STATUS':'OK'});
                res.write(currData);
                res.end();
        }
        else
        {
                console.log('NO DATA IN BUFFER TO READ');
                res.writeHead(200,{'X-STATUS':'OK'});
                res.end();
        }
    }
    else
    {
        console.log('No cookie to read data');
        res.writeHead(200,{'X-STATUS':'FAIL','X-ERROR':'NO COOKIE'});
        res.end();
    }

}

function disconnectOutboundTCP(res,req,error)
{

    var tcpConn=sessions[req.headers['cookie']];

    if(tcpConn!=null)
    {
        tcpConn.destroy();
        tcpConn=null;
        sessions[req.headers['cookie']]=null;
        dataBuff[req.headers['cookie']]=null;
    }

    if(error!=null)
    {
        res.writeHead(200,{'X-STATUS':'FAIL','X-ERROR':error.message,'Set-Cookie':'; expires=Thu, 01 Jan 1970 00:00:00 GMT'});
        res.end();
     }
     else
     {
     res.writeHead(200,{'Set-Cookie':'; expires=Thu, 01 Jan 1970 00:00:00 GMT','X-STATUS':'OK'});
     res.end();
     }

}

function forwardData(req,res)
{
  var forwardData;

      req.on('data', function (chunk) {
          forwardData=chunk;
        });

      req.on('end', function (){
          if(forwardData!=null)
          {
                  var tcpSocket=sessions[req.headers['cookie']];

                  if(tcpSocket!=null)
                  {
                  tcpSocket.write(forwardData);
                  res.writeHead(200,{'X-STATUS':'OK'});
                  res.end();
                  }
                  else
                  {
                  console.log('No Cookie session to forward');
                  res.writeHead(200,{'X-STATUS':'FAIL','X-ERROR':'NO COOKIE'});
                  res.end();
                  }
          }
          else
          {
                  console.log('No data in FORWARD');
                  res.writeHead(200,{'X-STATUS':'OK'});
                  res.end();
          }

        });
}

var server=http.createServer(function (req, res) {

//   for(var item in req.headers) {
//       console.log('REQ: '+item + ": " + req.headers[item]);
//     }

    var cmd=req.headers['x-cmd'];

    if(cmd!=null)
    {
        if(cmd=='CONNECT')
        {
         console.log('CONNECT')
            try
            {
                createOutboundTCP(res,req);
            }
            catch(error)
            {
                disconnectOutboundTCP(res,req,error);
            }
        }

        else if(cmd=='DISCONNECT')
        {
         console.log('DISCONNECT')
                try
                {
                    disconnectOutboundTCP(res,req,null);
                }
                catch(error)
                {
                    disconnectOutboundTCP(res,req,error);
                }
        }

        else if(cmd=='READ')
        {
        console.log('READ')
                    try
                    {
                       readOutboundTCP(res,req);
                    }
                    catch(error)
                    {
                         disconnectOutboundTCP(res,req,error);
                    }
        }

        else if(cmd=='FORWARD')
        {
                    console.log('FORWARD');
                    try
                    {
                       forwardData(req,res);
                    }
                    catch(error)
                    {
                        disconnectOutboundTCP(res,req,error);
                    }
        }
        else
        {
        res.write("Georg says, 'All seems fine'");
        res.end();
        }
    }

    else
    {
    res.write("Georg says, 'All seems fine'");
    res.end();
    }

});

server.listen(80, '0.0.0.0', function() {
        console.log('Tunnel Listening on port ' + this.address().port);
}
);

var fs = require('fs');
//var spawn = require('child_process').spawn;
var crypto = require('crypto');
var inspect = require('util').inspect;
var buffersEqual = require('buffer-equal-constant-time');
var ssh2 = require('ssh2');
var utils = ssh2.utils;
//var stringArgv = require('string-argv');
var isWin = /^win/.test(process.platform);

var pubKey = utils.genPublicKey(utils.parseKey(fs.readFileSync('ssh2/user.pub')));

new ssh2.Server({
  hostKeys: [fs.readFileSync('ssh2/host.key')]
}, function(client) {
  console.log('Client connected!');
        var procs = [];
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
                  session.on('pty', function(accept, reject, info){
                          accept();
                  });
                  session.on('exec', function(accept, reject, info) {
                          var stream = accept();
                          var proc;
                          cargs = stringArgv.parseArgsStringToArgv(info.command);
                          // node versions pre-v5 do not have the `shell` option, so do it manually
                          if (! isWin ) {
                                  if (/^v[0-4]\./.test(process.version))
                                          proc = spawn('/bin/sh', [ '-c', info.command ]);
                                  else
                                          proc = spawn(cargs[0], cargs.slice(1), { shell: true});
                          } else {
                                          proc = spawn('powershell.exe', cargs);
                          }

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
        console.log('SSH Listening on port ' + this.address().port);
});

