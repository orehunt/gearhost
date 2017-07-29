{
"servers": [{
    "ssh": {
                "host": "127.0.0.1",
                "port": 22,
                "username": "user",
                "password": "password",
                "debug": true
            }
]}

var promptSSH = function (server, command) {
    var conn = new ssh();
    var deferred = Q.defer();

    if (server.debug === true) {
        server.debug = function(output) {
            console.log(output);
        }
    }

    conn.on('ready', function() {
        conn.shell(function(error, stream) {
            var body = '';

            if (error) {
                deferred.reject(error);
            }
            stream.on('data', function(data) {
                body += data;
            })
            stream.on('close', function () {
                conn.end();
                return deferred.resolve(body);
            })
            .stderr.on('data', function(data) {
                body += 'STDERR: ' + data;
                conn.end();
                return deferred.reject(new Error(body));
            })
            stream.write(command);
        });
    })
    .connect(server);
    return deferred.promise;
};

    it('debugging SSH2 Streams', function(done) {
        functions.promptSSH(config.servers[0].ssh, 'ls -al\nexit\n')
        .then(function (body) {
            done();
        })
        .fail(done);
    });
}
