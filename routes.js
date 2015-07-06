Router.configure({
  layoutTemplate: 'main'
});

Router.route('/', function () {
  this.render('home');
});

Router.route('/companies', function () {
  this.render('companies');
});

Router.route('/about', function () {
  this.render('about');
});

Router.route('/company/:name', function () {
  this.render('companyPage', {
    data: function () {
      var companyName = this.params.name;
      return {
        company: Companies.findOne({name: companyName}),
        reviews: Reviews.find({company: companyName})
      }
    }
  });
});