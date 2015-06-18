// internDB.js

Reviews = new Mongo.Collection('reviews');

if (Meteor.isClient) {

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
      return Reviews.find();
    }
  })

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    console.log("hello server");
  });
}
