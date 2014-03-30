Members = new Meteor.Collection('members');

// see ownsProfile and adminUser functions in lib/permissions.js
// This allows client side editing and deleting of member profiles
Members.allow({
	update: ownsProfile,
	remove: ownsProfile
});

Members.allow({
	update: adminUser,
	remove: adminUser
})

// this restricts client side editing of fields not on this list.
// It uses _.without to return an array of any updates to fields not listed.
// Then it checks to see if that array is > 0.
Members.deny({
	update: function(userId, member, fieldNames) {
		//may only edit the following fields:
		return (_.without(fieldNames, 'routeName', 'firstname', 'lastname', 'suffix', 'prefix', 'institution1', 'institution2', 'institution3', 'labName', 'labAddress1', 'email', 'title', 'labAddress2', 'city', 'state', 'zip', 'labPhone', 'country', 'imageUrl').length > 0);
	}
});

Meteor.methods({
	member: function(memberAttributes) {
		var user = Meteor.user(),
		memberWithSameEmail = Members.findOne({ email: memberAttributes.email });

		// ensure the user is logged in
		if (!user)
			throw new Meteor.Error(401, "You need to login to Create a New Member Profile");

		// ensure members have names
		if (!memberAttributes.lastname)
			throw new Meteor.Error(422, 'Please fill in the last name field.');

		if (!memberAttributes.firstname)
			throw new Meteor.Error(422, 'Please fill in the first name field.');

		// check that there are no current members with same email
		if (memberAttributes.email && memberWithSameEmail) {
			throw new Meteor.Error(302, 
				'A profile is already associated with this email.',
				memberWithSameEmail._id);
		}
		var member = _.extend(_.pick(memberAttributes, 'user_id', 'routeName', 'email', 'firstname', 'lastname', 'suffix', 'prefix', 'institution1', 'institution2', 'institution3', 'labName', 
				'labAddress1', 'title', 'labAddress2', 'city', 'state', 'zip', 'labPhone', 'country', 'imageUrl' ), {
			submitted: new Date().getTime()
		});

		var memberId = Members.insert(member);

		return memberId;
	},

	memberExists: function(user_id) {
		var user = Meteor.user(),
		memberWithSameId = Members.findOne({userId: user_id});
		if(memberWithSameId && user_id){
			return memberWithSameId._id;
		} else {
			throw new Meteor.Error(404, 'No Profile exists for this user');
		}	
	}
});
