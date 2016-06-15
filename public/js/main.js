require.config({
  paths: {
    jquery: 'libs/jquery',
    underscore: 'libs/underscore',
    backbone: 'libs/backbone',
    bootstrap: 'libs/bootstrap',
    io: 'libs/socket.io'
  }

});

require(['app'], function(App){
  var app = new App();
});