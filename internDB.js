// internDB.js

Reviews = new Mongo.Collection('reviews');
Companies = new Mongo.Collection('companies');
Jobs = new Mongo.Collection('jobs');

if (Meteor.isClient) {
  Session.set('filtered', 'no');

  Template.search.events({
    'submit': function (event) {
      event.preventDefault();
      var searchKey = event.target.searchKey.value;
      if (searchKey !== "") {
        Session.set('filtered', 'yes');
        Session.set('searchKey', event.target.searchKey.value);
      } else {
        Session.set('filtered', 'no');
      }
      document.getElementById("searchForm").reset();
    }
  });

  Template.addReview.events({
    'button click': function () {
      var company = prompt("What company did you work at?");
    },
    'submit form': function (event) {
      event.preventDefault();
      Reviews.insert({
        company: event.target.company.value,
        job: event.target.job.value,
        review: event.target.review.value
      });
      Companies.insert({
        company: event.target.company.value
      });
      Jobs.insert({
        job: event.target.job.value
      })
      document.getElementById("reviewForm").reset();
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
