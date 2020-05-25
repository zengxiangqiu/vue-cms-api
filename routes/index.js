var cmsRouter = require('./cms');
var entrysRouter = require('./entrys');

const InitRouter=function(app){
  app.use('/api/entries', entrysRouter);
  app.use('/api/cms',cmsRouter);
}

module.exports = {InitRouter}