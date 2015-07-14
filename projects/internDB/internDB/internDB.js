// internDB.js

// var options = {
//   keepHistory: 1000 * 60 * 5,
//   localSearch: true
// };
// var fields = ['packageName', 'description'];

// PackageSearch = new SearchSource('packages', fields, options);

// SearchSource.defineSource('packages', function(searchText, options) {
//   var options = {sort: {isoScore: -1}, limit: 20};
  
//   if(searchText) {
//     var regExp = buildRegExp(searchText);
//     var selector = {$or: [
//       {packageName: regExp},
//       {description: regExp}
//     ]};
    
//     return Packages.find(selector, options).fetch();
//   } else {
//     return Packages.find({}, options).fetch();
//   }
// });

// function buildRegExp(searchText) {
//   // this is a dumb implementation
//   var parts = searchText.trim().split(/[ \-\:]+/);
//   return new RegExp("(" + parts.join('|') + ")", "ig");
// }


// Template.searchResult.helpers({
//   getPackages: function() {
//     return PackageSearch.getData({
//       transform: function(matchText, regExp) {
//         return matchText.replace(regExp, "<b>$&</b>")
//       },
//       sort: {isoScore: -1}
//     });
//   },
  
//   isLoading: function() {
//     return PackageSearch.getStatus().loading;
//   }
// });


// Template.searchBox.events({
//   "keyup #search-box": _.throttle(function(e) {
//     var text = $(e.target).val().trim();
//     PackageSearch.search(text);
//   }, 200)
// });


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
