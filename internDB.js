// internDB.js

Reviews = new Mongo.Collection('reviews');
Companies = new Mongo.Collection('companies');

if (Meteor.isClient) {
  Session.setDefault('filtered', false);

  Template.nav.events({
    'click .navbar-brand': function () {
      Session.set('filtered', false);
    }
  })

  Template.reviewModal.events({
    'click #btn-submit-review': function () {
      $("#review-form").submit();
    },
    'submit form': function (event) {
      event.preventDefault();
      var companyName = event.target.inputCompany.value;
      var newReview = {
        company: companyName,
        job: event.target.inputJob.value,
        review: event.target.inputReview.value
      };
      Meteor.call('insertReview', newReview);
      if (Companies.find({name: companyName}).fetch().length === 0) {
        var newCompany = {
          name: companyName,
          reviews: 1
        }
        Meteor.call('insertCompany', newCompany);
      } else {
        Meteor.call('updateCompany', companyName);
      }
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
        return Reviews.find({company: key}, {$orderby: {_id: -1}}).fetch();
      } else {
        return Reviews.find({}, {$orderby: {_id: -1}}).fetch();
      }
    }
  });

  Template.companies.helpers({
    companiesList: function () {
      return Companies.find().fetch();
    }
  });
}

if (Meteor.isServer) {
  Meteor.methods({
    insertReview: function (newReview) {
      Reviews.insert(newReview);
    },
    insertCompany: function (newCompany) {
      Companies.insert(newCompany);
    },
    updateCompany: function (companyName) {
      // increments the number of reviews associated with the company
      Companies.update(
        {name: companyName},
        {$inc: {reviews: 1}});
    }
  });
}
