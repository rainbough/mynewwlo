Template.contact.events({
	"submit form": function(e) {
		e.preventDefault();

		var contactEmail = {
			senderName: $(e.target).find('[name=senderName]').val(),
			email: $(e.target).find('[name=email]').val(),
			message: $(e.target).find('[name=message]').val()
		}

		console.log(contactEmail);
		console.log(contactEmail.senderName);
		console.log(contactEmail.message);

		Meteor.call("sendContactEmail", contactEmail ,function(error, result){

			if(error){
				throwError(error.reason);
			}
			else
				// alertsuccess("Your contact email has been sent!");
				Router.go('contact');
		
			
		});
	}
});