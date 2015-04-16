// Include the cluster module
var cluster = require('cluster');

// Code to run if we're in the master process
if (cluster.isMaster) {

    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;
    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', function (worker) {
        // Replace the dead worker, we're not sentimental
        console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();
    });

// Code to run if we're in a worker process
} else {

    var mongoose = require('mongoose');
    //connect to local mongodb database    
    mongoose.connect(process.env.MONGOLAB_URI);
    //attach lister to connected event
    mongoose.connection.once('connected', function() {
        console.log('connected');
    });

    // Include Express
    var express = require('express');
    var path = require('path');
    var compression = require('compression')
    // Create a new Express application
    var app = express();
    app.get('/data', function(req, res){
        var imageData=require('./model/LocalityImageDataSchema');
        imageData.find({},function(err, imageDataList){
            res.jsonp(imageDataList);
        });
    })
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(compression({filter: shouldCompress}))

 function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }

  // fallback to standard filter function
  return compression.filter(req, res)
}
    // Add a basic route – index page
    app.set('port', process.env.PORT || 3000);
    app.listen(app.get('port'));
    console.log('Worker ' + cluster.worker.id + ' running!');
}
