Router.route('/', function () {
    this.render('reviews');
});

Router.route('/companies', function () {
    this.render('companies');
});

Router.route('/about', function () {
    this.render('about');
});