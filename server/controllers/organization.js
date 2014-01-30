"use strict";
var passport = require('passport');

module.exports.set = function(app) {

	var Organization = app.get('models').Organization,
		User = app.get('models').User;
    

	 /**
	 *	Get all my organizations
	 */
	app.get('/organizations', passport.ensureAuthenticated, function (req, res) {
		// get user
		User.find({ where: {angellist_id: req.user.angellist_id} })
		.success(function (user) {
			if (user == null) { res.send('User not found');return; }
			
			// get user's organizations
			user.getOrganizations()
			.success(function (organizations) {
				res.send(organizations);
			})
			.error(function (error) {
				res.writeHead(500);
				res.end('Server error');
			});
		})
		.error(function (error) {
			res.writeHead(500);
			res.end('Server error');
		});
	});


	/**
	 *	Create new organization
	 */
	app.post('/organizations', passport.ensureAuthenticated, function (req, res) {
		var postData = req.body;

		// check data
		if (!postData.name || postData.name.length == 0) {
			res.writeHead(400);
			res.end('Missing fields');
			return;
		}

		// get user
		User.find({ where: {angellist_id: req.user.angellist_id} })
		.success(function (user) {
			if (user == null) { res.send('User not found');return; }
			Organization.create({ name: postData.name })
			.success(function (newOrganization) {
				// add new organization
				user.addOrganization(newOrganization, {role: 10})
				.success(function () {
					res.send('OK');
				})
				.error(function (error) {
					res.writeHead(500);
					res.end('Server error');
				});
			})
			.error(function (error) {
				res.writeHead(500);
				res.end('Server error');
			});
		})
		.error(function (error) {
			res.writeHead(500);
			res.end('Server error');
		});
	});


	/**
	 *	Get organization details
	 */
	app.get('/organizations/:id', passport.ensureAuthenticated, function (req, res) {
		// get user
		User.find({ where: {angellist_id: req.user.angellist_id} })
		.success(function (user) {
			// get organization
			user.getOrganizations({ where: {id: req.params.id} })
			.success(function (organizations) {
				if (organizations == null) { res.writeHead(400);res.end('Organization not found');return; }
				if (organizations.length > 0) {
					organizations[0].getUsers()
					.success(function (users) {
						// add user's role
						for (var i in users) {
							users[i].token = '';
							users[i].dataValues.role = users[i].UserRoles.role;
						}
						organizations[0].dataValues.members	 = users;
						res.send(organizations[0]);
					})
					.error(function (error) {
						res.writeHead(500);
						res.end('Server error');
					});
				} else {
					res.send('No results');
				}
			})
			.error(function (error) {
				res.writeHead(500);
				res.end('Server error');
			});
		})
		.error(function (error) {
			res.writeHead(500);
			res.end('Server error');
		});
	});


	/**
	 *	Invite to organization
	 */
	app.post('/organizations/:id/users/:userId', passport.ensureAuthenticated, function (req, res) {
		var postData = req.body;

		// check data
		if (postData.role == null) {
			res.writeHead(400);
			res.end('Missing fields');
			return;
		}

		// get organization
		Organization.find({ where: {id: req.params.id} })
		.success(function (organization) {
			if (organization == null) { res.end('Organization not found');return; }
			// check user is admin
			organization.getUsers({where: {userId: req.user.id, role: 10}})
			.success(function (users) {
				if (users.length > 0) {
					// get invitee user
					User.find({ where: {id: req.params.userId}})
					.success(function (invitee) {
						if (invitee == null) { res.writeHead(400);res.end('User not found');return; }

						// add user to organization
						organization.addUser(invitee, {role: postData.role})
						.success(function () {
							res.send('OK');
						})
						.error(function (error) {
							res.writeHead(500);
							res.end('Server error');
						});
					})
					.error(function (error) {
						res.writeHead(500);
						res.end('Server error');
					});
				} else {
					res.writeHead(400);
					res.end('Unauthorized');
				}
			})
			.error(function (error) {
				res.writeHead(500);
				res.end('Server error');
			});
		})
		.error(function (error) {
			res.writeHead(500);
			res.end('Server error');
		});
	});


	/**
	 *	Update permissions
	 */
	app.post('/organizations/:id/users/:userId/changePermission', passport.ensureAuthenticated, function (req, res) {
		var postData = req.body;

		// check data
		if (!postData.role) {
			res.writeHead(400);
			res.end('Missing fields');
			return;
		}

		// get organization
		Organization.find({ where: {id: req.params.id} })
		.success(function (organization) {
			if (organization == null) { res.end('Organization not found');return; }
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
							res.end('OK');
						} else {
							res.end('Invitee not found');
						}
					})
					.error(function (error) {
						res.writeHead(500);
						res.end('Server error');
					});
				} else {
					res.writeHead(400);
					res.end('Unauthorized');
				}
			})
			.error(function (error) {
				res.writeHead(500);
				res.end('Server error');
			});
		})
		.error(function (error) {
			res.writeHead(500);
			res.end('Server error');
		});
	});


	/**
	 *	Leave organization
	 */
	app.post('/organizations/:id/users/:userId/leave', passport.ensureAuthenticated, function (req, res) {
		var userId = req.user.id;
		var leaverId = req.params.userId;

		// get organization
		Organization.find({ where: {id: req.params.id} })
		.success(function (organization) {
			if (organization == null) { res.end('Organization not found');return; }
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
								res.end('OK');
							} else {
								res.end('Invitee not found');
							}
						})
						.error(function (error) {
							res.writeHead(500);
							res.end('Server error');
						});
					} else {
						res.writeHead(400);
						res.end('Unauthorized');
					}
				})
				.error(function (error) {
					res.writeHead(500);
					res.end('Server error');
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
								res.end('OK');
							} else {
								res.end('Invitee not found');
							}
						})
						.error(function (error) {
							res.writeHead(500);
							res.end('Server error');
						});
					} else {
						organization.getUsers()
						.success(function (users) {
							if (users.length == 1) {
								organization.destroy();
								res.end('OK');
							} else {
								res.writeHead(400);
								res.end('Choose another admin before leaving this organization');
							}
						});
					}
				})
				.error(function (error) {
					res.writeHead(500);
					res.end('Server error');
				});
			}
		})
		.error(function (error) {
			res.writeHead(500);
			res.end('Server error');
		});
	});

}
