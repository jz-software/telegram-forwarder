const spawn = require('child_process').spawn;

class Client{
  constructor(){
    this.create();
  }
  create(){
    this.process = spawn('python3', ['./src/python/Client.py']);
    this.process.stdout.on('end', function(){
      console.log('client process ended');
    });
  }
}

module.exports = Client;