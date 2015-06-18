if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);
  Session.setDefault('name', 'InternDB')

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });

  Template.homepage.helpers({
    name: function () {
      return Session.get('name');
    }
  })

  Template.homepage.events({
    'click button': function () {
      if (Session.get('name') === 'InternDB') { 
        Session.set('name', 'made by CORE Impulse');
        console.log(Session.get('name'));
      } else {
        Session.set('name', 'InternDB');
        console.log(Session.get('name'));
      }
    }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    console.log("hello server");
  });
}
