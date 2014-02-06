"use strict";
var httpreq = require('httpreq');
var email = require('../email');

module.exports.init = function(app, config, security, errors) {

	var Organization = app.get('models').Organization;
	var Invitation = app.get('models').Invitation;
	var User = app.get('models').User;


	 /**
	 *	Get all my organizations
	 */
	app.get('/organizations', security.authenticationRequired, function (req, res, next) {
		// get user
		User.find({ where: {angellist_id: req.user.angellist_id} })
		.success(function (user) {
			if (user == null) { return next(new errors.BadRequest('User not found')); }
			
			// get user's organizations
			user.getOrganizations()
			.success(function (organizations) {
				res.send(organizations);
			})
			.error(function (error) {
				return next(new errors.Error('Server error'));
			});
		})
		.error(function (error) {
			return next(new errors.Error('Server error'));
		});
	});


	/**
	 *	Get my organizations where I am admin
	 */
	app.get('/organizationsAdmin', security.authenticationRequired, function (req, res, next) {
		// get user
		User.find({ where: {angellist_id: req.user.angellist_id} })
		.success(function (user) {
			if (user == null) { return next(new errors.BadRequest('User not found')); }
			
			// get user's organizations
			user.getOrganizations({ where: {role: 10}})
			.success(function (organizations) {
				res.send(organizations);
			})
			.error(function (error) {
				return next(new errors.Error('Server error'));
			});
		})
		.error(function (error) {
			return next(new errors.Error('Server error'));
		});
	});


	/**
	 *	Create new organization
	 */
	app.post('/organizations', security.authenticationRequired, function (req, res, next) {
		var postData = req.body;

		// check data
		if (!postData.name || postData.name.length == 0) {
			return next(new errors.BadRequest('Missing fields'));
		}

		// get user
		User.find({ where: {angellist_id: req.user.angellist_id} })
		.success(function (user) {
			if (user == null) { return next(new errors.BadRequest('User not found')); }
			Organization.create({ name: postData.name })
			.success(function (newOrganization) {
				// add new organization
				user.addOrganization(newOrganization, {role: 10})
				.success(function () {
					res.send(200);
				})
				.error(function (error) {
					return next(new errors.Error('Server error'));
				});
			})
			.error(function (error) {
				return next(new errors.Error('Server error'));
			});
		})
		.error(function (error) {
			return next(new errors.Error('Server error'));
		});
	});


	/**
	 *	Get organization details
	 */
	app.get('/organizations/:id', security.authenticationRequired, function (req, res, next) {
		// get user
		User.find({ where: {angellist_id: req.user.angellist_id} })
		.success(function (user) {
			if (user == null) { return next(new errors.BadRequest('User not found')); }

			// get organization
			user.getOrganizations({ where: {id: req.params.id} })
			.success(function (organizations) {
				if (organizations == null || organizations.length == 0) { 
					return next(new errors.BadRequest('Organization not found')); 
				} else {
					organizations[0].dataValues.isAdmin = false;
					organizations[0].getUsers()
					.success(function (users) {
						// add user's role
						for (var i in users) {
							if (users[i].id == req.user.id && users[i].UserRoles.role == 10) {
								organizations[0].dataValues.isAdmin = true;
							}
							users[i].token = '';
							users[i].dataValues.role = users[i].UserRoles.role;
						}
						organizations[0].dataValues.members	= users;
						res.send(organizations[0]);
					})
					.error(function (error) {
						return next(new errors.Error('Server error'));
					});
				}
			})
			.error(function (error) {
				return next(new errors.Error('Server error'));
			});
		})
		.error(function (error) {
			return next(new errors.Error('Server error'));
		});
	});


	/**
	 *	Invite to organization
	 */
	app.post('/organizations/:id/users/:userId', security.authenticationRequired, function (req, res, next) {
		var postData = req.body;

		// check data
		if (postData.role == null) {
			return next(new errors.BadRequest('Missing fields')); 
		}

		// get organization
		Organization.find({ where: {id: req.params.id} })
		.success(function (organization) {
			if (organization == null) { return next(new errors.BadRequest('Organization not found')); }

			// check user is admin
			organization.getUsers({where: {userId: req.user.id, role: 10}})
			.success(function (users) {
				if (users.length > 0) {
					var requestOwner = users[0];
					// get invitee user
					User.find({ where: {angellist_id: req.params.userId}})
					.success(function (invitee) {
						if (invitee == null) { 
							// invite contact to AngelPal
							httpreq.post('https://api.angel.co/1/messages', {
								parameters: {
									recipient_id: req.params.userId,
									body: email.prepareMail(null, email.templates.inviteToOrganization, [organization.name]).text,
									access_token: req.user.token	
								}
							}, function (err, result) {
								if (err) {
									return next(new errors.Error('Server error'));
								} else {
									// add pending invitations to table
									Invitation.create({ 
										organization_id: organization.id, 
										angellist_id: req.params.userId,
										role: postData.role
									})
									.success(function (newInvitation) {
										res.send(200);
									})
									.error(function (error) {
										return next(new errors.Error('Server error'));
									});
								}
							});
						} else {
							// add user to organization
							organization.addUser(invitee, {role: postData.role})
							.success(function () {
								res.send(200);
							})
							.error(function (error) {
								return next(new errors.Error('Server error'));
							});
						}
					})
					.error(function (error) {
						return next(new errors.Error('Server error'));
					});
				} else {
					return next(new errors.Unauthorized('User is not an admin'));
				}
			})
			.error(function (error) {
				return next(new errors.Error('Server error'));
			});
		})
		.error(function (error) {
			return next(new errors.Error('Server error'));
		});
	});


	/**
	 *	Update permissions
	 */
	app.post('/organizations/:id/users/:userId/changePermission', security.authenticationRequired, function (req, res, next) {
		var postData = req.body;

		// check data
		if (!postData.role) {
			return next(new errors.BadRequest('Missing fields')); 
		}

		// get organization
		Organization.find({ where: {id: req.params.id} })
		.success(function (organization) {
			if (organization == null) { return next(new errors.BadRequest('Organization not found')); }

			// check user is admin
			organization.getUsers({where: {userId: req.user.id, role: 10}})
			.success(function (users) {
				if (users.length > 0) {
					// get invitee user
					organization.getUsers({where: {userId: req.params.userId, organizationId: req.params.id}})
					.success(function (users) {
						if (users.length > 0) {
							users[0].UserRoles.role = postData.role;
							users[0].UserRoles.save();
							res.end(200);
						} else {
							return next(new errors.BadRequest('User not found'));
						}
					})
					.error(function (error) {
						return next(new errors.Error('Server error'));
					});
				} else {
					return next(new errors.Unauthorized('User is not an admin'));
				}
			})
			.error(function (error) {
				return next(new errors.Error('Server error'));
			});
		})
		.error(function (error) {
			return next(new errors.Error('Server error'));
		});
	});


	/**
	 *	Leave organization
	 */
	app.post('/organizations/:id/users/:userId/leave', security.authenticationRequired, function (req, res, next) {
		var userId = req.user.id;
		var leaverId = req.params.userId;

		// get organization
		Organization.find({ where: {id: req.params.id} })
		.success(function (organization) {
			if (organization == null) { return next(new errors.BadRequest('Organization not found')); }
			if (userId != leaverId) {
				// kicking off another user
				// check if user is admin
				organization.getUsers({where: {userId: userId, role: 10}})
				.success(function (users) {
					if (users.length > 0) {
						// get invitee user
						organization.getUsers({where: {userId: leaverId, organizationId: req.params.id}})
						.success(function (users) {
							if (users.length > 0) {
								organization.removeUser(users[0]);
								res.end(200);
							} else {
								return next(new errors.BadRequest('User not found'));
							}
						})
						.error(function (error) {
							return next(new errors.Error('Server error'));
						});
					} else {
						return next(new errors.Unauthorized('User is not an admin'));
					}
				})
				.error(function (error) {
					return next(new errors.Error('Server error'));
				});
			} else {
				// user is leaving
				// check if there is an admin left
				organization.getUsers({where: {userId: {ne: userId}, role: 10}})
				.success(function (users) {
					if (users.length > 0) {
						organization.getUsers({where: {userId: leaverId, organizationId: req.params.id}})
						.success(function (users) {
							if (users.length > 0) {
								organization.removeUser(users[0]);
								res.end(200);
							} else {
								return next(new errors.BadRequest('User not found'));
							}
						})
						.error(function (error) {
							return next(new errors.Error('Server error'));
						});
					} else {
						organization.getUsers()
						.success(function (users) {
							if (users.length == 1) {
								organization.destroy();
								res.end('OK');
							} else {
								return next(new errors.BadRequest('Choose another admin before leaving this organization'));
							}
						});
					}
				})
				.error(function (error) {
					return next(new errors.Error('Server error'));
				});
			}
		})
		.error(function (error) {
			return next(new errors.Error('Server error'));
		});
	});

}
