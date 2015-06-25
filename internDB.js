// internDB.js

Reviews = new Mongo.Collection('reviews');

if (Meteor.isClient) {
  Session.setDefault('filtered', 'no');
  Session.setDefault('showModal', 'no');

  Template.nav.events({
    'click #show-modal': function () {
      Session.set('showModal', 'yes');
    }
  })

  Template.reviewModal.events({
    'click #btn-submit-review': function () {
      $("#review-form").submit();
    },
    'submit form': function (event) {
      console.log("submitted");
      event.preventDefault();
      Reviews.insert({
        company: event.target.inputCompany.value,
        job: event.target.inputJob.value,
        review: event.target.inputReview.value
      });
      document.getElementById("review-form").reset();
    }
  })

  // Template.addReview.events({
  //   'button click': function () {
  //     var company = prompt("What company did you work at?");
  //   },
  //   'submit form': function (event) {
  //     event.preventDefault();
  //     Reviews.insert({
  //       company: event.target.company.value,
  //       job: event.target.job.value,
  //       review: event.target.review.value
  //     });
  //     Companies.insert({
  //       company: event.target.company.value
  //     });
  //     Jobs.insert({
  //       job: event.target.job.value
  //     })
  //     document.getElementById("reviewForm").reset();
  //   }
  // });

  Template.search.events({
    'submit form': function (event) {
      event.preventDefault();
      var searchKey = event.target.searchKey.value;
      if (searchKey !== "") {
        Session.set('filtered', 'yes');
        Session.set('searchKey', event.target.searchKey.value);
      } else {
        Session.set('filtered', 'no');
      }
      document.getElementById("search-form").reset();
    },
    'button click': function (event) {
      event.preventDefault();
      var searchKey = event.target.searchKey.value;
      if (searchKey !== "") {
        Session.set('filtered', 'yes');
        Session.set('searchKey', event.target.searchKey.value);
      } else {
        Session.set('filtered', 'no');
      }
      document.getElementById("search-form").reset();
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
    // Meteor.methods
  });
}
