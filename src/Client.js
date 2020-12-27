const spawn = require('child_process').spawn;
py = null;

function createClient(){
  py = spawn('python3', ['./src/python/Client.py']);

  py.stdout.on('data', function(data){
    const message = data.toString().trim();
  });
  py.stdout.on('end', function(){
    console.log('end');
    createClient();
  });
}

createClient();

module.exports = py;