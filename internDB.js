// internDB.js

Reviews = new Mongo.Collection('reviews');

if (Meteor.isClient) {
  Session.set('filtered', 'no');

  Template.search.events({
    'submit': function (event) {
      event.preventDefault();
      Session.set('filtered', 'yes');
      Session.set('searchKey', event.target.searchKey.value);
    }
  });

  Template.addReview.events({
    'submit form': function (event) {
      event.preventDefault();
      Reviews.insert({
        company: event.target.company.value,
        job: event.target.job.value,
        review: event.target.review.value
      });
    }
  });

  Template.reviews.helpers({
    reviewsList: function () {
      if (Session.get("filtered") === "yes") {
        var key = Session.get('searchKey');
        return Reviews.find({company: key});
      } else {
        return Reviews.find();
      }
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    console.log("hello server");
  });
}
