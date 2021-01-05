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
  async getDialogs(){
    return new Promise((resolve, reject) => {
      const script = spawn('python3', ['./src/python/getDialogs.py']);
      script.stdout.on('data', function(data){
        try {
          const dialogs = JSON.parse(data.toString());
          resolve(dialogs);
        } catch (error) {
          reject(error);
        }
      })
    })
  }
  redirectPreviousMessages(origin, destination){
    const script = spawn('python3', ['./src/python/redirectPreviousMessages.py'], { env: { 
      'ORIGIN': origin, 
      "DESTINATION": destination 
    }});
    script.stdout.on('data', function(data){
      console.log(data.toString());
    })
    return script;
  }
}

module.exports = Client;