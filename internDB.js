// internDB.js

Reviews = new Mongo.Collection('reviews');
Companies = new Mongo.Collection('companies');

if (Meteor.isClient) {
  Session.setDefault('filtered', false);
  Session.setDefault('category', 'Company');

  Template.nav.events({
    'click .navbar-brand': function () {
      Session.set('filtered', false);
    }
  })

  Template.reviewModal.events({
    'click #btn-submit-review': function () {
      $("#review-form").submit();
    },
    'click .close': function () {
      document.getElementById("review-form").reset();
    },
    'submit form': function (event) {
      event.preventDefault();
      var companyName = event.target.inputCompany.value;
      var rating = parseFloat(event.target.inputRating.value);
      var interview = parseFloat(event.target.interviewRating.value);
      var newReview = {
        company: companyName,
        job: event.target.inputJob.value,
        rating: rating,
        review: event.target.inputReview.value,
        interviewRating: event.target.interviewRating.value,
        interviewQuestions: event.target.interviewQuestions.value
      };
      Meteor.call('insertReview', newReview);
      if (Companies.find({name: companyName}).fetch().length === 0) {
        var newCompany = {
          name: companyName,
          reviews: 1,
          ratingSum: rating,
          ratingAvg: rating,
          interviewSum: interview,
          interviewAvg: interview
        }
        Meteor.call('insertCompany', newCompany);
      } else {
        Meteor.call('updateCompany', companyName, rating, interview);
      }
      document.getElementById("review-form").reset();
    }
  });

  Template.search.helpers({
    category: function() {
      return Session.get('category');
    }
  })

  Template.search.events({
    'submit review-form': function (event) {
      event.preventDefault();
      var searchKey = event.target.searchKey.value;
      if (searchKey !== "") {
        Session.set('filtered', true);
        Session.set('searchKey', searchKey);
      } else {
        Session.set('filtered', false);
      }
      document.getElementById("search-form").reset();
    },
    'click #company': function () {
      Session.set('category', 'Company');
    },
    'click #job': function () {
      Session.set('category', 'Job');
    }
  });

  Template.reviews.helpers({
    reviewsList: function () {
      if (Session.get('filtered')) {
        var key = Session.get('searchKey');
        // regex to make key case-sensitive and work with partial strings of any length
        var regex = new RegExp(key.replace(/(\S+)/g, function(s) { return "\\b" + s + ".*" }).replace(/\s+/g, ''), "gi");
        // finds matching company or matching job
        if (Session.get('category') === 'Company') {
          console.log('searching by company')
          return Reviews.find({company: regex}, {$orderby: {_id: -1}}).fetch();
        } else {
          return Reviews.find({job: regex}, {$orderby: {_id: -1}}).fetch();
        }
      } else {
        console.log('returning all reviews')
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
    updateCompany: function (companyName, newRating, newInterview) {
      // increments the number of reviews associated with the company
      var company = Companies.findOne({name: companyName});
      var numReviews = company.reviews += 1;
      Companies.update(
        {name: companyName},
        {
          $inc: {ratingSum: newRating, interviewSum: newInterview}, 
          $set: {
            reviews: numReviews,
            ratingAvg: (parseFloat(company.ratingSum) + newRating)/numReviews, 
            interviewAvg: (parseFloat(company.interviewSum) + newInterview)/numReviews
          }
        }
      );
    }
  });
}
