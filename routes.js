Router.configure({
  // the default layout
  layoutTemplate: 'Layout'
});

Router.route('/', function () {
  // set the layout programmatically
  this.layout('Layout');

  // render the PageOne template
  this.render('map');
});
/*
Router.use(function () {
  if (!this.willBeHandledOnServer())
    console.error("No route found for url " + JSON.stringify(this.url) + ".");
});
*/
