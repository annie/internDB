// internDB.js

Reviews = new Mongo.Collection('reviews');

if (Meteor.isClient) {
  Session.setDefault('filtered', false);

  Template.reviewModal.events({
    'click #btn-submit-review': function () {
      $("#review-form").submit();
    },
    'submit form': function (event) {
      event.preventDefault();
      var newReview = {
        company: event.target.inputCompany.value,
        job: event.target.inputJob.value,
        review: event.target.inputReview.value
      };
      Meteor.call('insertReview', newReview);
      document.getElementById("review-form").reset();
    }
  })

  Template.search.events({
    'submit form, button click': function (event) {
      event.preventDefault();
      var searchKey = event.target.searchKey.value;
      if (searchKey !== "") {
        Session.set('filtered', true);
        Session.set('searchKey', searchKey);
      } else {
        Session.set('filtered', false);
      }
      document.getElementById("search-form").reset();
    }
  });

  Template.reviews.helpers({
    reviewsList: function () {
      if (Session.get('filtered')) {
        var key = Session.get('searchKey');
        return Reviews.find({company: key}).fetch();
      } else {
        return Reviews.find().fetch();
      }
    }
  });

  Template.companies.helpers({
    companiesList: function () {
      console.log("retrieving reviews for companies list");
      return Reviews.find().fetch();
      // eventually this should return a list sorted by rating
    }
  });
}

if (Meteor.isServer) {
  Meteor.methods({
    insertReview: function (newReview) {
      Reviews.insert(newReview);
    }
  });
}
