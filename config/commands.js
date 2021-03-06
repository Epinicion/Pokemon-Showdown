/**
 * Commands
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * These are commands. For instance, you can define the command 'whois'
 * here, then use it by typing /whois into Pokemon Showdown.
 *
 * A command can be in the form:
 *   ip: 'whois',
 * This is called an alias: it makes it so /ip does the same thing as
 * /whois.
 *
 * But to actually define a command, it's a function:
 *   birkal: function(target, room, user) {
 *     this.sendReply("It's not funny anymore.");
 *   },
 *
 * Commands are actually passed five parameters:
 *   function(target, room, user, connection, cmd, message)
 * Most of the time, you only need the first three, though.
 *
 * target = the part of the message after the command
 * room = the room object the message was sent to
 *   The room name is room.id
 * user = the user object that sent the message
 *   The user's name is user.name
 * connection = the connection that the message was sent from
 * cmd = the name of the command
 * message = the entire message sent by the user
 *
 * If a user types in "/msg zarel, hello"
 *   target = "zarel, hello"
 *   cmd = "msg"
 *   message = "/msg zarel, hello"
 *
 * Commands return the message the user should say. If they don't
 * return anything or return something falsy, the user won't say
 * anything.
 *
 * Commands have access to the following functions:
 *
 * this.sendReply(message)
 *   Sends a message back to the room the user typed the command into.
 *
 * this.sendReplyBox(html)
 *   Same as sendReply, but shows it in a box, and you can put HTML in
 *   it.
 *
 * this.popupReply(message)
 *   Shows a popup in the window the user typed the command into.
 *
 * this.add(message)
 *   Adds a message to the room so that everyone can see it.
 *   This is like this.sendReply, except everyone in the room gets it,
 *   instead of just the user that typed the command.
 *
 * this.send(message)
 *   Sends a message to the room so that everyone can see it.
 *   This is like this.add, except it's not logged, and users who join
 *   the room later won't see it in the log, and if it's a battle, it
 *   won't show up in saved replays.
 *   You USUALLY want to use this.add instead.
 *
 * this.logEntry(message)
 *   Log a message to the room's log without sending it to anyone. This
 *   is like this.add, except no one will see it.
 *
 * this.addModCommand(message)
 *   Like this.add, but also logs the message to the moderator log
 *   which can be seen with /modlog.
 *
 * this.logModCommand(message)
 *   Like this.addModCommand, except users in the room won't see it.
 *
 * this.can(permission)
 * this.can(permission, targetUser)
 *   Checks if the user has the permission to do something, or if a
 *   targetUser is passed, check if the user has permission to do
 *   it to that user. Will automatically give the user an "Access
 *   denied" message if the user doesn't have permission: use
 *   user.can() if you don't want that message.
 *
 *   Should usually be near the top of the command, like:
 *     if (!this.can('potd')) return false;
 *
 * this.canBroadcast()
 *   Signifies that a message can be broadcast, as long as the user
 *   has permission to. This will check to see if the user used
 *   "!command" instead of "/command". If so, it will check to see
 *   if the user has permission to broadcast (by default, voice+ can),
 *   and return false if not. Otherwise, it will set it up so that
 *   this.sendReply and this.sendReplyBox will broadcast to the room
 *   instead of just the user that used the command.
 *
 *   Should usually be near the top of the command, like:
 *     if (!this.canBroadcast()) return false;
 *
 * this.canTalk()
 *   Checks to see if the user can speak in the room. Returns false
 *   if the user can't speak (is muted, the room has modchat on, etc),
 *   or true otherwise.
 *
 *   Should usually be near the top of the command, like:
 *     if (!this.canTalk()) return false;
 *
 * this.canTalk(message)
 *   Checks to see if the user can say the message. In addition to
 *   running the checks from this.canTalk(), it also checks to see if
 *   the message has any banned words or is too long. Returns the
 *   filtered message, or a falsy value if the user can't speak.
 *
 *   Should usually be near the top of the command, like:
 *     target = this.canTalk(target);
 *     if (!target) return false;
 *
 * this.parse(message)
 *   Runs the message as if the user had typed it in.
 *
 *   Mostly useful for giving help messages, like for commands that
 *   require a target:
 *     if (!target) return this.parse('/help msg');
 *
 *   After 10 levels of recursion (calling this.parse from a command
 *   called by this.parse from a command called by this.parse etc)
 *   we will assume it's a bug in your command and error out.
 *
 * this.targetUserOrSelf(target)
 *   If target is blank, returns the user that sent the message.
 *   Otherwise, returns the user with the username in target, or
 *   a falsy value if no user with that username exists.
 *
 * this.splitTarget(target)
 *   Splits a target in the form "user, message" into its
 *   constituent parts. Returns message, and sets this.targetUser to
 *   the user, and this.targetUsername to the username.
 *
 *   Remember to check if this.targetUser exists before going further.
 *
 * Unless otherwise specified, these functions will return undefined,
 * so you can return this.sendReply or something to send a reply and
 * stop the command there.
 *
 * @license MIT license
 */
var poofeh = true;
var commands = exports.commands = {

	ip: 'whois',
	getip: 'whois',
	rooms: 'whois',
	altcheck: 'whois',
	alt: 'whois',
	alts: 'whois',
	getalts: 'whois',
	whois: function(target, room, user) {
		var targetUser = this.targetUserOrSelf(target);
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}

		this.sendReply('User: '+targetUser.name);
		if (user.can('alts', targetUser.getHighestRankedAlt())) {
			var alts = targetUser.getAlts();
			var output = '';
			for (var i in targetUser.prevNames) {
				if (output) output += ", ";
				output += targetUser.prevNames[i];
			}
			if (output) this.sendReply('Previous names: '+output);

			for (var j=0; j<alts.length; j++) {
				var targetAlt = Users.get(alts[j]);
				if (!targetAlt.named && !targetAlt.connected) continue;

				this.sendReply('Alt: '+targetAlt.name);
				output = '';
				for (var i in targetAlt.prevNames) {
					if (output) output += ", ";
					output += targetAlt.prevNames[i];
				}
				if (output) this.sendReply('Previous names: '+output);
			}
		}
		if (config.groups[targetUser.group] && config.groups[targetUser.group].name) {
			this.sendReply('Group: ' + config.groups[targetUser.group].name + ' (' + targetUser.group + ')');
		}
		if (targetUser.isSysop) {
			this.sendReply('(Pok\xE9mon Showdown System Operator)');
		}
		if (!targetUser.authenticated) {
			this.sendReply('(Unregistered)');
		}
		if (!this.broadcasting && (user.can('ip', targetUser) || user === targetUser)) {
			var ips = Object.keys(targetUser.ips);
			this.sendReply('IP' + ((ips.length > 1) ? 's' : '') + ': ' + ips.join(', '));
		}
		var output = 'In rooms: ';
		var first = true;
		for (var i in targetUser.roomCount) {
			if (i === 'global' || Rooms.get(i).isPrivate) continue;
			if (!first) output += ' | ';
			first = false;

			output += '<a href="/'+i+'" room="'+i+'">'+i+'</a>';
		}
		this.sendReply('|raw|'+output);
	},

	ipsearch: function(target, room, user) {
		if (!this.can('rangeban')) return;
		var atLeastOne = false;
		this.sendReply("Users with IP "+target+":");
		for (var userid in Users.users) {
			var user = Users.users[userid];
			if (user.latestIp === target) {
				this.sendReply((user.connected?"+":"-")+" "+user.name);
				atLeastOne = true;
			}
		}
		if (!atLeastOne) this.sendReply("No results found.");
	},

	/*********************************************************
	 * Shortcuts
	 *********************************************************/

	invite: function(target, room, user) {
		target = this.splitTarget(target);
		if (!this.targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		var roomid = (target || room.id);
		if (!Rooms.get(roomid)) {
			return this.sendReply('Room '+roomid+' not found.');
		}
		return this.parse('/msg '+this.targetUsername+', /invite '+roomid);
	},

	/*********************************************************
	 * Informational commands
	 *********************************************************/

	stats: 'data',
	dex: 'data',
	pokedex: 'data',
	data: function(target, room, user) {
		if (!this.canBroadcast()) return;

		var data = '';
		var targetId = toId(target);
		var newTargets = Tools.dataSearch(target);
		if (newTargets && newTargets.length) {
			for (var i = 0; i < newTargets.length; i++) {
				if (newTargets[i].id !== targetId && !Tools.data.Aliases[targetId] && !i) {
					data = "No Pokemon, item, move or ability named '" + target + "' was found. Showing the data of '" + newTargets[0].name + "' instead.\n";
				}
				data += '|c|~|/data-' + newTargets[i].searchType + ' ' + newTargets[i].name + '\n';
			}
		} else {
			data = "No Pokemon, item, move or ability named '" + target + "' was found. (Check your spelling?)";
		}

		this.sendReply(data);
	},

	dexsearch: function (target, room, user) {
		if (!this.canBroadcast()) return;

		if (!target) return this.parse('/help dexsearch');
		var targets = target.split(',');
		var moves = {}, tiers = {}, colours = {}, ability = {}, gens = {}, types = {};
		var allTiers = {'uber':1,'ou':1,'uu':1,'ru':1,'nu':1,'lc':1,'cap':1,'bl':1,'bl2':1,'nfe':1, 'limbo':1};
		var allColours = {'green':1,'red':1,'blue':1,'white':1,'brown':1,'yellow':1,'purple':1,'pink':1,'gray':1,'black':1};
		var count = 0;
		var showAll = false;
		var output = 10;

		for (var i in targets) {
			target = Tools.getMove(targets[i]);
			if (target.exists) {
				if (!moves.count) {
					count++;
					moves.count = 0;
				}
				if (moves.count === 4) {
					return this.sendReply('Specify a maximum of 4 moves.');
				}
				moves[target] = 1;
				moves.count++;
				continue;
			}

			target = Tools.getAbility(targets[i]);
			if (target.exists) {
				if (!ability.count) {
					count++;
					ability.count = 0;
				}
				if (ability.count === 1) {
					return this.sendReply('Specify only one ability.');
				}
				ability[target] = 1;
				ability.count++;
				continue;
			}

			target = targets[i].trim().toLowerCase();
			if (target in allTiers) {
				if (!tiers.count) {
					count++;
					tiers.count = 0;
				}
				tiers[target] = 1;
				tiers.count++;
				continue;
			}
			if (target in allColours) {
				if (!colours.count) {
					count++;
					colours.count = 0;
				}
				colours[target] = 1;
				colours.count++;
				continue;
			}
			var targetInt = parseInt(target);
			if (0 < targetInt && targetInt < 6) {
				if (!gens.count) {
					count++;
					gens.count = 0;
				}
				gens[targetInt] = 1;
				gens.count++;
				continue;
			}
			if (target === 'all') {
				if (this.broadcasting) {
					return this.sendReply('A search with the parameter "all" cannot be broadcast.')
				}
				showAll = true;
				continue;
			}
			if (target.indexOf(' type') > -1) {
				target = target.charAt(0).toUpperCase() + target.slice(1, target.indexOf(' type'));
				if (target in Tools.data.TypeChart) {
					if (!types.count) {
						count++;
						types.count = 0;
					}
					if (types.count === 2) {
						return this.sendReply('Specify a maximum of two types.');
					}
					types[target] = 1;
					types.count++;
					continue;
				}
			} else {
				return this.sendReply('"' + targets[i].trim() + '" could not be found in any of the search categories.');
			}
		}

		if (showAll && count === 0) return this.sendReply('No search parameters other than "all" were found.\nTry "/help dexsearch" for more information on this command.');

		while (count > 0) {
			count--;
			var tempResults = [];
			if (!results) {
				for (var pokemon in Tools.data.Pokedex) {
					pokemon = Tools.getTemplate(pokemon);
					if (pokemon.tier !== 'Illegal' && (pokemon.tier !== 'CAP' || 'cap' in tiers)) {
						tempResults.add(pokemon);
					}
				}
			} else {
				for (var mon in results) tempResults.add(results[mon]);
			}
			var results = [];

			if (types.count > 0) {
				for (var mon in tempResults) {
					if (types.count === 1) {
						if (tempResults[mon].types[0] in types || tempResults[mon].types[1] in types) results.add(tempResults[mon]);
					} else {
						if (tempResults[mon].types[0] in types && tempResults[mon].types[1] in types) results.add(tempResults[mon]);
					}
				}
				types.count = 0;
				continue;
			}

			if (tiers.count > 0) {
				for (var mon in tempResults) {
					if (tempResults[mon].tier.toLowerCase() in tiers) results.add(tempResults[mon]);
				}
				tiers.count = 0;
				continue;
			}

			if (ability.count > 0) {
				for (var mon in tempResults) {
					for (var monAbility in tempResults[mon].abilities) {
						if (Tools.getAbility(tempResults[mon].abilities[monAbility]) in ability) results.add(tempResults[mon]);
					}
				}
				ability.count = 0;
				continue;
			}

			if (colours.count > 0) {
				for (var mon in tempResults) {
					if (tempResults[mon].color.toLowerCase() in colours) results.add(tempResults[mon]);
				}
				colours.count = 0;
				continue;
			}

			if (moves.count > 0) {
				var problem;
				var move = {};
				for (var mon in tempResults) {
					var lsetData = {set:{}};
					var template = Tools.getTemplate(tempResults[mon].id);
					for (var i in moves) {
						move = Tools.getMove(i);
						if (move.id !== 'count') {
							if (!move.exists) return this.sendReplyBox('"' + move + '" is not a known move.');
							problem = TeamValidator().checkLearnset(move, template, lsetData);
							if (problem) break;
						}
					}
					if (!problem) results.add(tempResults[mon]);
				}
				moves.count = 0;
				continue;
			}

			if (gens.count > 0) {
				for (var mon in tempResults) {
					if (tempResults[mon].gen in gens) results.add(tempResults[mon]);
				}
				gens.count = 0;
				continue;
			}
		}

		var resultsStr = '';
		if (results && results.length > 0) {
			for (var i = 0; i < results.length; ++i) results[i] = results[i].species;
			if (showAll || results.length <= output) {
				resultsStr = results.join(', ');
			} else {
				var hidden = string(results.length - output);
				results.sort(function(a,b) {return Math.round(Math.random());});
				var shown = results.slice(0, 10);
				resultsStr = shown.join(', ');
				resultsStr += ', and ' + hidden + ' more. Redo the search with "all" as a search parameter to show all results.';
			}
		} else {
			resultsStr = 'No Pokémon found.';
		}
		return this.sendReplyBox(resultsStr);
	},

	learnset: 'learn',
	learnall: 'learn',
	learn5: 'learn',
	g6learn: 'learn',
	learn: function(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help learn');

		if (!this.canBroadcast()) return;

		var lsetData = {set:{}};
		var targets = target.split(',');
		var template = Tools.getTemplate(targets[0]);
		var move = {};
		var problem;
		var all = (cmd === 'learnall');
		if (cmd === 'learn5') lsetData.set.level = 5;
		if (cmd === 'g6learn') lsetData.format = {noPokebank: true};

		if (!template.exists) {
			return this.sendReply('Pokemon "'+template.id+'" not found.');
		}

		if (targets.length < 2) {
			return this.sendReply('You must specify at least one move.');
		}

		for (var i=1, len=targets.length; i<len; i++) {
			move = Tools.getMove(targets[i]);
			if (!move.exists) {
				return this.sendReply('Move "'+move.id+'" not found.');
			}
			problem = TeamValidator().checkLearnset(move, template, lsetData);
			if (problem) break;
		}
		var buffer = ''+template.name+(problem?" <span class=\"message-learn-cannotlearn\">can't</span> learn ":" <span class=\"message-learn-canlearn\">can</span> learn ")+(targets.length>2?"these moves":move.name);
		if (!problem) {
			var sourceNames = {E:"egg",S:"event",D:"dream world"};
			if (lsetData.sources || lsetData.sourcesBefore) buffer += " only when obtained from:<ul class=\"message-learn-list\">";
			if (lsetData.sources) {
				var sources = lsetData.sources.sort();
				var prevSource;
				var prevSourceType;
				for (var i=0, len=sources.length; i<len; i++) {
					var source = sources[i];
					if (source.substr(0,2) === prevSourceType) {
						if (prevSourceCount < 0) buffer += ": "+source.substr(2);
						else if (all || prevSourceCount < 3) buffer += ', '+source.substr(2);
						else if (prevSourceCount == 3) buffer += ', ...';
						prevSourceCount++;
						continue;
					}
					prevSourceType = source.substr(0,2);
					prevSourceCount = source.substr(2)?0:-1;
					buffer += "<li>gen "+source.substr(0,1)+" "+sourceNames[source.substr(1,1)];
					if (prevSourceType === '5E' && template.maleOnlyHidden) buffer += " (cannot have hidden ability)";
					if (source.substr(2)) buffer += ": "+source.substr(2);
				}
			}
			if (lsetData.sourcesBefore) buffer += "<li>any generation before "+(lsetData.sourcesBefore+1);
			buffer += "</ul>";
		}
		this.sendReplyBox(buffer);
	},

	weak: 'weakness',
	weakness: function(target, room, user){
		var targets = target.split(/[ ,\/]/);

		var pokemon = Tools.getTemplate(target);
		var type1 = Tools.getType(targets[0]);
		var type2 = Tools.getType(targets[1]);

		if (pokemon.exists) {
			target = pokemon.species;
		} else if (type1.exists && type2.exists) {
			pokemon = {types: [type1.id, type2.id]};
			target = type1.id + "/" + type2.id;
		} else if (type1.exists) {
			pokemon = {types: [type1.id]};
			target = type1.id;
		} else {
			return this.sendReplyBox(target + " isn't a recognized type or pokemon.");
		}

		var weaknesses = [];
		Object.keys(Tools.data.TypeChart).forEach(function (type) {
			var notImmune = Tools.getImmunity(type, pokemon);
			if (notImmune) {
				var typeMod = Tools.getEffectiveness(type, pokemon);
				if (typeMod == 1) weaknesses.push(type);
				if (typeMod == 2) weaknesses.push("<b>" + type + "</b>");
			}
		});

		if (!weaknesses.length) {
			this.sendReplyBox(target + " has no weaknesses.");
		} else {
			this.sendReplyBox(target + " is weak to: " + weaknesses.join(', ') + " (not counting abilities).");
		}
	},

	matchup: 'effectiveness',
	effectiveness: function(target, room, user) {
		var targets = target.split(/[,/]/);
		var type = Tools.getType(targets[1]);
		var pokemon = Tools.getTemplate(targets[0]);
		var defender;

		if (!pokemon.exists || !type.exists) {
			// try the other way around
			pokemon = Tools.getTemplate(targets[1]);
			type = Tools.getType(targets[0]);
		}
		defender = pokemon.species+' (not counting abilities)';

		if (!pokemon.exists || !type.exists) {
			// try two types
			if (Tools.getType(targets[0]).exists && Tools.getType(targets[1]).exists) {
				// two types
				type = Tools.getType(targets[0]);
				defender = Tools.getType(targets[1]).id;
				pokemon = {types: [defender]};
				if (Tools.getType(targets[2]).exists) {
					defender = Tools.getType(targets[1]).id + '/' + Tools.getType(targets[2]).id;
					pokemon = {types: [Tools.getType(targets[1]).id, Tools.getType(targets[2]).id]};
				}
			} else {
				if (!targets[1]) {
					return this.sendReply("Attacker and defender must be separated with a comma.");
				}
				return this.sendReply("'"+targets[0].trim()+"' and '"+targets[1].trim()+"' aren't a recognized combination.");
			}
		}

		if (!this.canBroadcast()) return;

		var typeMod = Tools.getEffectiveness(type.id, pokemon);
		var notImmune = Tools.getImmunity(type.id, pokemon);
		var factor = 0;
		if (notImmune) {
			factor = Math.pow(2, typeMod);
		}

		this.sendReplyBox(''+type.id+' attacks are '+factor+'x effective against '+defender+'.');
	},

	uptime: function(target, room, user) {
		if (!this.canBroadcast()) return;
		var uptime = process.uptime();
		var uptimeText;
		if (uptime > 24*60*60) {
			var uptimeDays = Math.floor(uptime/(24*60*60));
			uptimeText = ''+uptimeDays+' '+(uptimeDays == 1 ? 'day' : 'days');
			var uptimeHours = Math.floor(uptime/(60*60)) - uptimeDays*24;
			if (uptimeHours) uptimeText += ', '+uptimeHours+' '+(uptimeHours == 1 ? 'hour' : 'hours');
		} else {
			uptimeText = uptime.seconds().duration();
		}
		this.sendReplyBox('Uptime: <b>'+uptimeText+'</b>');
	},

	groups: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('+ <b>Voice</b> - They can use ! commands like !groups, and talk during moderated chat<br />' +
			'% <b>Driver</b> - The above, and they can also mute and lock users and check for alts<br />' +
			'@ <b>Moderator</b> - The above, and they can ban users<br />' +
			'&amp; <b>Leader</b> - The above, and they can promote moderators and force ties<br />' +
			'~ <b>Administrator</b> - They can do anything, like change what this message says<br />' +
			'# <b>Room Owner</b> - They are administrators of the room and can almost totally control it');
	},

	opensource: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Pokemon Showdown is open source:<br />- Language: JavaScript<br />- <a href="https://github.com/Zarel/Pokemon-Showdown/commits/master">What\'s new?</a><br />- <a href="https://github.com/Zarel/Pokemon-Showdown">Server source code</a><br />- <a href="https://github.com/Zarel/Pokemon-Showdown-Client">Client source code</a>');
	},

	avatars: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Your avatar can be changed using the Options menu (it looks like a gear) in the upper right of Pokemon Showdown.');
	},

	introduction: 'intro',
	intro: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('New to competitive pokemon?<br />' +
			'- <a href="http://www.smogon.com/forums/threads/3496279/">Beginner\'s Guide to Pokémon Showdown</a><br />' +
			'- <a href="http://www.smogon.com/dp/articles/intro_comp_pokemon">An introduction to competitive Pokémon</a><br />' +
			'- <a href="http://www.smogon.com/bw/articles/bw_tiers">What do "OU", "UU", etc mean?</a><br />' +
			'- <a href="http://www.smogon.com/bw/banlist/">What are the rules for each format? What is "Sleep Clause"?</a>');
	},

	calculator: 'calc',
	calc: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Pokemon Showdown! damage calculator. (Courtesy of Honko)<br />' +
			'- <a href="http://pokemonshowdown.com/damagecalc/">Damage Calculator</a>');
	},

	cap: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('An introduction to the Create-A-Pokemon project:<br />' +
			'- <a href="http://www.smogon.com/cap/">CAP project website and description</a><br />' +
			'- <a href="http://www.smogon.com/forums/showthread.php?t=48782">What Pokemon have been made?</a><br />' +
			'- <a href="http://www.smogon.com/forums/showthread.php?t=3464513">Talk about the metagame here</a><br />' +
			'- <a href="http://www.smogon.com/forums/showthread.php?t=3466826">Practice BW CAP teams</a>');
	},

	gennext: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('NEXT (also called Gen-NEXT) is a mod that makes changes to the game:<br />' +
			'- <a href="https://github.com/Zarel/Pokemon-Showdown/blob/master/mods/gennext/README.md">README: overview of NEXT</a><br />' +
			'Example replays:<br />' +
			'- <a href="http://pokemonshowdown.com/replay/gennextou-37815908">roseyraid vs Zarel</a><br />' +
			'- <a href="http://pokemonshowdown.com/replay/gennextou-37900768">QwietQwilfish vs pickdenis</a>');
	},

	om: 'othermetas',
	othermetas: function(target, room, user) {
		if (!this.canBroadcast()) return;
		target = toId(target);
		var buffer = '';
		var matched = false;
		if (!target || target === 'all') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/forums/forums/206/">Information on the Other Metagames</a><br />';
		}
		if (target === 'all' || target === 'hackmons') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/forums/threads/3475624/">Hackmons</a><br />';
		}
		if (target === 'all' || target === 'balancedhackmons' || target === 'bh') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/forums/threads/3463764/">Balanced Hackmons</a><br />';
		}
		if (target === 'all' || target === 'glitchmons') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/forums/threads/3467120/">Glitchmons</a><br />';
		}
		if (target === 'all' || target === 'tiershift' || target === 'ts') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/forums/threads/3479358/">Tier Shift</a><br />';
		}
		if (target === 'all' || target === 'seasonal') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/sim/seasonal">Seasonal Ladder</a><br />';
		}
		if (target === 'all' || target === 'stabmons') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/forums/threads/3484106/">STABmons</a>';
		}
		if (target === 'all' || target === 'omotm' || target === 'omofthemonth' || target === 'month') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/forums/threads/3481155/">OM of the Month</a>';
		}
		if (!matched) {
			return this.sendReply('The Other Metas entry "'+target+'" was not found. Try /othermetas or /om for general help.');
		}
		this.sendReplyBox(buffer);
	},

	roomhelp: function(target, room, user) {
		if (room.id === 'lobby') return this.sendReply('This command is too spammy for lobby.');
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Room drivers (%) can use:<br />' +
			'- /warn OR /k <em>username</em>: warn a user and show the Pokemon Showdown rules<br />' +
			'- /mute OR /m <em>username</em>: 7 minute mute<br />' +
			'- /hourmute OR /hm <em>username</em>: 60 minute mute<br />' +
			'- /unmute <em>username</em>: unmute<br />' +
			'- /announce OR /wall <em>message</em>: make an announcement<br />' +
			'<br />' +
			'Room moderators (@) can also use:<br />' +
			'- /roomban OR /rb <em>username</em>: bans user from the room<br />' +
			'- /roomunban <em>username</em>: unbans user from the room<br />' +
			'- /roomvoice <em>username</em>: appoint a room voice<br />' +
			'- /roomdevoice <em>username</em>: remove a room voice<br />' +
			'- /modchat <em>[off/autoconfirmed/+]</em>: set modchat level<br />' +
			'<br />' +
			'Room owners (#) can also use:<br />' +
			'- /roomdesc <em>description</em>: set the room description on the room join page<br />' +
			'- /roommod, /roomdriver <em>username</em>: appoint a room moderator/driver<br />' +
			'- /roomdemod, /roomdedriver <em>username</em>: remove a room moderator/driver<br />' +
			'- /modchat <em>[%/@/#]</em>: set modchat level<br />' +
			'- /declare <em>message</em>: make a global declaration<br />' +
			'</div>');
	},

	restarthelp: function(target, room, user) {
		if (room.id === 'lobby' && !this.can('lockdown')) return false;
		if (!this.canBroadcast()) return;
		this.sendReplyBox('The server is restarting. Things to know:<br />' +
			'- We wait a few minutes before restarting so people can finish up their battles<br />' +
			'- The restart itself will take around 0.6 seconds<br />' +
			'- Your ladder ranking and teams will not change<br />' +
			'- We are restarting to update Pokémon Showdown to a newer version' +
			'</div>');
	},

	rule: 'rules',
	rules: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Please follow the rules:<br />' +
			'- <a href="http://pokemonshowdown.com/rules">Rules</a><br />' +
			'</div>');
	},

	faq: function(target, room, user) {
		if (!this.canBroadcast()) return;
		target = target.toLowerCase();
		var buffer = '';
		var matched = false;
		if (!target || target === 'all') {
			matched = true;
			buffer += '<a href="http://www.smogon.com/sim/faq">Frequently Asked Questions</a><br />';
		}
		if (target === 'all' || target === 'deviation') {
			matched = true;
			buffer += '<a href="http://www.smogon.com/sim/faq#deviation">Why did this user gain or lose so many points?</a><br />';
		}
		if (target === 'all' || target === 'doubles' || target === 'triples' || target === 'rotation') {
			matched = true;
			buffer += '<a href="http://www.smogon.com/sim/faq#doubles">Can I play doubles/triples/rotation battles here?</a><br />';
		}
		if (target === 'all' || target === 'randomcap') {
			matched = true;
			buffer += '<a href="http://www.smogon.com/sim/faq#randomcap">What is this fakemon and what is it doing in my random battle?</a><br />';
		}
		if (target === 'all' || target === 'restarts') {
			matched = true;
			buffer += '<a href="http://www.smogon.com/sim/faq#restarts">Why is the server restarting?</a><br />';
		}
		if (target === 'all' || target === 'staff') {
			matched = true;
			buffer += '<a href="http://www.smogon.com/sim/staff_faq">Staff FAQ</a><br />';
		}
		if (target === 'all' || target === 'autoconfirmed') {
			matched = true;
			buffer += 'A user is autoconfirmed when they have won at least one rated battle and has been registered for a week or longer.<br />';
		}
		if (!matched) {
			return this.sendReply('The FAQ entry "'+target+'" was not found. Try /faq for general help.');
		}
		this.sendReplyBox(buffer);
	},

	banlists: 'tiers',
	tier: 'tiers',
	tiers: function(target, room, user) {
		if (!this.canBroadcast()) return;
		target = toId(target);
		var buffer = '';
		var matched = false;
		if (!target || target === 'all') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/tiers/">Smogon Tiers</a><br />';
			buffer += '- <a href="http://www.smogon.com/bw/banlist/">The banlists for each tier</a><br />';
		}
		if (target === 'all' || target === 'ubers' || target === 'uber') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/bw/tiers/uber">Uber Pokemon</a><br />';
		}
		if (target === 'all' || target === 'overused' || target === 'ou') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/bw/tiers/ou">Overused Pokemon</a><br />';
		}
		if (target === 'all' || target === 'underused' || target === 'uu') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/bw/tiers/uu">Underused Pokemon</a><br />';
		}
		if (target === 'all' || target === 'rarelyused' || target === 'ru') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/bw/tiers/ru">Rarelyused Pokemon</a><br />';
		}
		if (target === 'all' || target === 'neverused' || target === 'nu') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/bw/tiers/nu">Neverused Pokemon</a><br />';
		}
		if (target === 'all' || target === 'littlecup' || target === 'lc') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/bw/tiers/lc">Little Cup Pokemon</a><br />';
		}
		if (target === 'all' || target === 'doubles') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/bw/metagames/doubles">Doubles</a><br />';
		}
		if (!matched) {
			return this.sendReply('The Tiers entry "'+target+'" was not found. Try /tiers for general help.');
		}
		this.sendReplyBox(buffer);
	},

	analysis: 'smogdex',
	strategy: 'smogdex',
	smogdex: function(target, room, user) {
		if (!this.canBroadcast()) return;

		var targets = target.split(',');
		var pokemon = Tools.getTemplate(targets[0]);
		var item = Tools.getItem(targets[0]);
		var move = Tools.getMove(targets[0]);
		var ability = Tools.getAbility(targets[0]);
		var atLeastOne = false;
		var generation = (targets[1] || "bw").trim().toLowerCase();
		var genNumber = 5;
		var doublesFormats = {'vgc2012':1,'vgc2013':1,'doubles':1};
		var doublesFormat = (!targets[2] && generation in doublesFormats)? generation : (targets[2] || '').trim().toLowerCase();
		var doublesText = '';
		if (generation === "bw" || generation === "bw2" || generation === "5" || generation === "five") {
			generation = "bw";
		} else if (generation === "dp" || generation === "dpp" || generation === "4" || generation === "four") {
			generation = "dp";
			genNumber = 4;
		} else if (generation === "adv" || generation === "rse" || generation === "rs" || generation === "3" || generation === "three") {
			generation = "rs";
			genNumber = 3;
		} else if (generation === "gsc" || generation === "gs" || generation === "2" || generation === "two") {
			generation = "gs";
			genNumber = 2;
		} else if(generation === "rby" || generation === "rb" || generation === "1" || generation === "one") {
			generation = "rb";
			genNumber = 1;
		} else {
			generation = "bw";
		}
		if (doublesFormat !== '') {
			// Smogon only has doubles formats analysis from gen 5 onwards.
			if (!(generation in {'bw':1,'xy':1}) || !(doublesFormat in doublesFormats)) {
				doublesFormat = '';
			} else {
				doublesText = {'vgc2012':'VGC 2012 ','vgc2013':'VGC 2013 ','doubles':'Doubles '}[doublesFormat];
				doublesFormat = '/' + doublesFormat;
			}
		}

		// Pokemon
		if (pokemon.exists) {
			atLeastOne = true;
			if (genNumber < pokemon.gen) {
				return this.sendReplyBox(pokemon.name+' did not exist in '+generation.toUpperCase()+'!');
			}
			if (pokemon.tier === 'G4CAP' || pokemon.tier === 'G5CAP') {
				generation = "cap";
			}

			var poke = pokemon.name.toLowerCase();
			if (poke === 'nidoranm') poke = 'nidoran-m';
			if (poke === 'nidoranf') poke = 'nidoran-f';
			if (poke === 'farfetch\'d') poke = 'farfetchd';
			if (poke === 'mr. mime') poke = 'mr_mime';
			if (poke === 'mime jr.') poke = 'mime_jr';
			if (poke === 'deoxys-attack' || poke === 'deoxys-defense' || poke === 'deoxys-speed' || poke === 'kyurem-black' || poke === 'kyurem-white') poke = poke.substr(0,8);
			if (poke === 'wormadam-trash') poke = 'wormadam-s';
			if (poke === 'wormadam-sandy') poke = 'wormadam-g';
			if (poke === 'rotom-wash' || poke === 'rotom-frost' || poke === 'rotom-heat') poke = poke.substr(0,7);
			if (poke === 'rotom-mow') poke = 'rotom-c';
			if (poke === 'rotom-fan') poke = 'rotom-s';
			if (poke === 'giratina-origin' || poke === 'tornadus-therian' || poke === 'landorus-therian') poke = poke.substr(0,10);
			if (poke === 'shaymin-sky') poke = 'shaymin-s';
			if (poke === 'arceus') poke = 'arceus-normal';
			if (poke === 'thundurus-therian') poke = 'thundurus-t';

			this.sendReplyBox('<a href="http://www.smogon.com/'+generation+'/pokemon/'+poke+doublesFormat+'">'+generation.toUpperCase()+' '+doublesText+pokemon.name+' analysis</a>, brought to you by <a href="http://www.smogon.com">Smogon University</a>');
		}

		// Item
		if (item.exists && genNumber > 1 && item.gen <= genNumber) {
			atLeastOne = true;
			var itemName = item.name.toLowerCase().replace(' ', '_');
			this.sendReplyBox('<a href="http://www.smogon.com/'+generation+'/items/'+itemName+'">'+generation.toUpperCase()+' '+item.name+' item analysis</a>, brought to you by <a href="http://www.smogon.com">Smogon University</a>');
		}

		// Ability
		if (ability.exists && genNumber > 2 && ability.gen <= genNumber) {
			atLeastOne = true;
			var abilityName = ability.name.toLowerCase().replace(' ', '_');
			this.sendReplyBox('<a href="http://www.smogon.com/'+generation+'/abilities/'+abilityName+'">'+generation.toUpperCase()+' '+ability.name+' ability analysis</a>, brought to you by <a href="http://www.smogon.com">Smogon University</a>');
		}

		// Move
		if (move.exists && move.gen <= genNumber) {
			atLeastOne = true;
			var moveName = move.name.toLowerCase().replace(' ', '_');
			this.sendReplyBox('<a href="http://www.smogon.com/'+generation+'/moves/'+moveName+'">'+generation.toUpperCase()+' '+move.name+' move analysis</a>, brought to you by <a href="http://www.smogon.com">Smogon University</a>');
		}

		if (!atLeastOne) {
			return this.sendReplyBox('Pokemon, item, move, or ability not found for generation ' + generation.toUpperCase() + '.');
		}
	},

  //TOUR COMMANDS

    tourcommands: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('Tournaments through /tour can be started by Voice (+) users and higher:<br \>' +
        '/tour [tier], [size] - Starts a tournament<br \>' +
                '/endtour - Ends a currently running tournament<br \>' +
                '/fj [username] - Force someone to join a tournament<br \>' +
                '/fl [username] - Force someone to leave a tournament<br \>' +
                '/toursize [size] - Changes the size of a currently running tournament<br \>' +
                '/replace [username], [username] - Replaces user in a tournament with the second user');
    },

        /***************************************
        * Trainer Cards *
        ***************************************/
natalie: function(target, room, user) {if (!this.canBroadcast()) return; this.sendReplyBox(
                '<b>Trainer:</b> Princess Natalie <br \>' +
		'<b>Ace:</b> Mega-Houndoom <br \>' +
		'Everyone maybe stronger, but I will never give up till I die!<br \>' +
		'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/houndoom.gif">'+ '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/hydreigon.gif">'+ '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/weavile.gif">')
		},
blak: function(target, room, user) {if (!this.canBroadcast()) return; this.sendReplyBox(
                '<b>Trainer:</b> Soaring BlakAir <br \>' +
		'<b>Ace:</b> Mega-Gyarados <br \>' +
		'The struggle is real (oi). Unless there is food involved.<br \>' +
		'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/gyarados-mega.gif">'+ '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/staraptor.gif">'+ '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/sceptile.gif">')
		},
kots: function(target, room, user) {if (!this.canBroadcast()) return; this.sendReplyBox(
                '<b>Trainer:</b> KOTS <br \>' +
		'<b>Ace:</b> Magnezone <br \>' +
		'I go hard like mothaf****n liquid swords<br \>' +
		'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/magnezone.gif">'+ '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/crawdaunt.gif">'+ '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/greninja.gif">')
		},
max: function(target, room, user) {if (!this.canBroadcast()) return; this.sendReplyBox(
                '<font color="#f30020"><font size="4"><b>Champion Maxerus</b></font></font><br\>'  +
		'<b>Ace:</b> Gliscor <br \>' +
		'All men dream: but not equally. Those who dream by night in the dusty recesses of their minds, wake in the day to find that it was vanity: but the dreamers of the day are dangerous men, for they may act their dream with open eyes, to make it possible.<br\>' +
'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/gliscor.gif">' + '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/zapdos.gif">'+ '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/sableye.gif">' + '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/sceptile.gif">')
},
sack: function(target, room, user) {if (!this.canBroadcast()) return; this.sendReplyBox(
                '<b>Trainer:</b> Sack <br \>' +
		'<b>Ace:</b> Absol <br \>' +
		'Sprite Supplier and helper to Epin<br \>' +
'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/absol.gif">')
},
giggle: function(target, room, user) {if (!this.canBroadcast()) return; this.sendReplyBox(
           '<img src="http://i.imgur.com/Jw72AwH.jpg">')
},
website: function(target, room, user) {if (!this.canBroadcast()) return; this.sendReplyBox(
           '<b> The following link is to our current and up to date website with instructions on how to join, challenge, or just read up on the Biblia League <br\>' +
           '- <a href="http://thebiblialeague.webs.com/">Current Biblia Website</a><br />')
},
kswiss: function(target, room, user) {if (!this.canBroadcast()) return; this.sendReplyBox(
                '<b>Trainer:</b> Swiss <br \>' +
		'<b>Ace:</b> Darmanitan <br \>' +
		'Your mom knows<br \>' +
'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/darmanitan.gif">')
},
lando: function(target, room, user) {if (!this.canBroadcast()) return; this.sendReplyBox(
                '<center><font size="4" color="brown"><b>Elite Four ProteanShakes</font color><font size="4" color="blue"<b>-Lando</b>' +
		'<center><b>Ace:</b> Landorus <br \>' +
		'One has not felt and witnessed true pain if they haven\'t lost someone dear to them. Willpower is what gets you through everything and I, Lando, have that power.<br \>' +
'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/landorus.gif">' + '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/deoxys.gif">' + '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/crawdaunt.gif">' + '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/lucario-mega.gif">')
},
lizard: function(target, room, user) {if (!this.canBroadcast()) return; this.sendReplyBox(
                '<b>Trainer:</b> Lizard <br \>' +
		'<b>Ace:</b> Gengar <br \>' +
		'Spore is for the weak<br \>' +
'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/gengar-3.gif">'+ '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/nidoking.gif">'+ '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/tentacruel.gif">')
},
pwns: function(target, room, user) {if (!this.canBroadcast()) return; this.sendReplyBox(
                '<b>Trainer:</b> Pwns <br \>' +
		'<b>Ace:</b> Gardevoir and Gallade <br \>' +
		'Get your Titanic rears in gear and kick some Olympian butt<br \>' +
'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/gallade.gif">'+ '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/gardevoir.gif">')
},
vain: function(target, room, user) {if (!this.canBroadcast()) return; this.sendReplyBox(
                '<b>Trainer:</b> Vain <br \>' +
		'<b>Ace:</b> Sableye <br \>' +
		'I am HIGH PRIEST VATICAN ASSASIN WARLOCK!<br \>' +
'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/zoroark.gif">'+ '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/umbreon.gif">'+ '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/sableye.gif">')
},
icicle: function(target, room, user) {if (!this.canBroadcast()) return; this.sendReplyBox(
                '<b>Trainer:</b> Icicle-The Ice Clown <br \>' +
		'<b>Ace:</b> Abomasnow <br \>' +
		'Icy alot of puns dont you?<br \>' +
'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/mamoswine.gif">'+ '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/abomasnow.gif">'+ '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/cloyster.gif">')
},
radar: function(target, room, user) {if (!this.canBroadcast()) return; this.sendReplyBox(
                '<b>Trainer:</b> Radar <br \>' +
		'The only chick that will sweep you with a Registeel, violate you with a Banded Hydregion, and wall you with a Yanmega, also I love Epin. <br \>' +
'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/yanmega.gif">'+ '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/hydreigon.gif">'+ '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/registeel.gif">')
},
enty: function(target, room, user) {if (!this.canBroadcast()) return; this.sendReplyBox(
                '<b>Trainer:</b> Entalp AKA Talpy<br \>' +
                '<b>Ace</b> Dragonite<br\>' +
		'Bitch please, Im Entalp.<br \>' +
'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/dragonite-2.gif">'+ '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/arcanine.gif">'+ '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/garchomp.gif">')
},
aspen: function(target, room, user) {if (!this.canBroadcast()) return; this.sendReplyBox(
                '<font color="#c600d8"><font size="4"><b>Prof. Aspen</b></font></font><br\><br\>' + '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/gible.gif">' +
		'<b>What I can help you with!:</b><br\>' + 
                '<b> Training:</b> I have trained numerous current and former members, namely former champions Khrolek and Lights, and current champ Epin.<br\>' + '<b>Instruct and Assist:</b> I can assist you in challenging the league and applying for a gym leader spot.<br\>' + '<b>Direct:</b> I can help you contact the correct people and find necessary information for your use and pleasure<br\>' )
},
hipi: function(target, room, user) {if (!this.canBroadcast()) return; this.sendReplyBox(
                '<b>Trainer:</b> Hipi <br \>' +
		'<b>Ace:</b> Sableye <br \>' +
		'Not everything in life is as it seems, life just leads to misery after misery with the occasional happy day.<br \>' +
'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/sableye.gif">'  + '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/manaphy.gif">'  + '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/klefki.gif">' )
},
splash: function(target, room, user) {if (!this.canBroadcast()) return; this.sendReplyBox(
                '<b>Trainer:</b> Splash <br \>' +
		'<b>Ace:</b> Bandido the Ludicolo <br \>' +
		'MY TEAM IS AT THE TOP PERCENTAGE<br \>' +
'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/azumarill.gif">'  + '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/suicune.gif">' + '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/ludicolo.gif">')
},
merikafuckya: function(target, room, user) {if (!this.canBroadcast()) return; this.sendReplyBox(
              '<img src="http://i.imgur.com/szsGcjs.gif">' )
},
bye: function(target, room, user) {if (!this.canBroadcast()) return; this.sendReplyBox(
              '<img src="http://i.imgur.com/ZxRqfGv.gif">' )
},
uwotm8: function(target, room, user) {if (!this.canBroadcast()) return; this.sendReplyBox(
              '<img src="http://i.imgur.com/KTj5fV4.gif">' )
},
america: function(target, room, user) {if (!this.canBroadcast()) return; this.sendReplyBox(
          '<img src="http://i.imgur.com/ki68Pis.jpg">')
},
shep: function(target, room, user) {if (!this.canBroadcast()) return; this.sendReplyBox(
                '<b>Trainer:</b> Shep <br \>' +
		'<b>Ace:</b> Mega-Mawile<br \>' +
		'Even the hardest armor was once just ore<br \>' +
'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/aggron.gif">'+ '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/forretress.gif">' + '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/aegislash.gif">')
},
kyo: function(target, room, user) {if (!this.canBroadcast()) return; this.sendReplyBox(
                '<b>Trainer:</b> Kyogre <br \>' +
		'<b>Ace:</b> Manaphy <br \>' +
		'Dont underestimate the drizzle. Its just the calm before the storm<br \>' +
		'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/kyogre.gif">'+ '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/manaphy.gif">'+ '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/tentacruel.gif">')},
epin: function(target, room, user) {if (!this.canBroadcast()) return; this.sendReplyBox(
                '<font color="#00cf0a"><font size="4"><b>Champion Epinicion</b></font></font><br\>'  +
		'<b>Ace:</b> Crustle <br \>' +
		'This city is afraid of me. I have seen its true face. The streets are extended gutters and the gutters are full of blood and when the drains finally scab over, all the vermin will drown. The accumulated filth of all their sex and murder will foam up about their waists and all the whores and politicians will look up and shout "Save us!"... and I will whisper "no". <br \>' +
		'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/crustle.gif" alt="Crustle"/>'+ '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/bisharp.gif">' + '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/genesect.gif">' + '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/mew.gif">' + '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/rayquaza.gif">'+ '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/hitmonlee.gif">' + '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/jolteon.gif">' + '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/treecko.gif"><br\>' + '<center><font color="#d80000"><b> Si Vis Pacem, Para Bellum</b></font>')},
kota: function(target, room, user) {if (!this.canBroadcast()) return; this.sendReplyBox(
                '<b>Savior:</b> Kota <br \>' +
		'I host this server, https://gist.github.com/kotarou3/7688036 <br \>' +
		'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/pikachu-5.gif">'+ '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/victini.gif">' + '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/shaymin.gif">')},
zeall: function(target, room, user) {if (!this.canBroadcast()) return; this.sendReplyBox(
                '<b>Trainer:</b> Zeall <br \>' +
		'<b>Ace:</b> Diggersby-doe <br \>' +
		'Zeall for reall<br \>' +
		'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/flareon.gif">'+ '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/diggersby.gif">'+ '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/cinccino.gif">')},
lavacadicemoo: function(target, room, user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('La vaca dice moo<br \>' +
                'The cow says moo!<br \>' +
                '<img src="http://www.apeconmyth.com/wp-content/uploads/2011/09/moo-cow.gif">')
        },
heavenldrs: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<font size="4"><b>Heaven Gym Leaders:</b></font><br\><br\>' +
                '<font color="#808080"><font size="2"><b>Gym Ldr. Khosro:</b></font> Type - Normal<br\>' +
                '<font color="#FF0000"><font size="2"><b>Gym Ldr. Kswiss:</b></font> Type - Fire<br\>' +
                '<font color="#0000FF"><font size="2"><b>Gym Ldr. ???:</b></font> Type - Water<br\>' +
                '<font color="#e9c900"><font size="2"><b>Gym Ldr. Scorcher:</b></font> Type - Electric<br\>' +
                '<font color="#008000"><font size="2"><b>Gym Ldr. Marluxia:</b></font> Type - Grass<br\>' +
                '<font color="#017f8a"><font size="2"><b>Gym Ldr. Icicle:</b></font> Type - Ice<br\>' +
                '<font color="#ea7500"><font size="2"><b>Gym Ldr. ???:</b></font> Type - Fighting<br\>' +
                '<font color="#800080"><font size="2"><b>Gym Ldr. ???:</b></font> Type - Poison<br\>' +
                '<font color="#A52A2A"><font size="2"><b>Gym Ldr. Intel:</b></font> Type - Ground<br\>' +
                '<font color="#00adf1"><font size="2"><b>Gym Ldr. ???:</b></font> Type - Flying<br\>' +
                '<font color="#FF00FF"><font size="2"><b>Gym Ldr. Topper:</b></font> Type - Psychic<br\>' +
                '<font color="#00b818"><font size="2"><b>Gym Ldr. Wolv:</b></font> Type - Bug<br\>' +
                '<font color="#6a4f3d"><font size="2"><b>Gym Ldr. ???:</b></font> Type - Rock<br\>' +
                '<font color="#9370DB"><font size="2"><b>Gym Ldr. ???:</b></font> Type - Ghost<br\>' +
                '<font color="#6A5ACD"><font size="2"><b>Gym Ldr. Wander:</b></font> Type - Dragon<br\>' +
                '<font color="#000000"><font size="2"><b>Gym Ldr. Sack:</b></font> Type - Dark<br\>' +
                '<font color="#6d6d6d"><font size="2"><b>Gym Ldr. Christ:</b></font> Type - Steel<br\>' +
                '<font color="#ea009f"><font size="2"><b>Gym Ldr. ???:</b></font> Type - Fairy<br\>' )
		},
heavene4: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<font size="4"><b>Heaven Elite Four:</b></font><br\>' +
                '<font color="#6d6d6d"><font size="2"><b>Elite Four Shep:</b></font> Type - Steel<br\>' +
                '<font color="#00adf1"><font size="2"><b>Elite Four Blakair:</b></font> Type - Flying<br\>' +
 '<font color="#ea009f"><font size="2"><b>Elite Four VPwns:</b></font> Type - Fairy<br\>' +
                '<font color="#0000FF"><font size="2"><b>Elite Four Splash:</b></font> Type - Water<br\><br\>' +
            '<font color="#000000"><font size="4"><b>Heaven Champion:</b></font><br\>' +
                '<font color="#00b818"><font size="3"><b>Champion Epin:</b></font> Type - Bug<br\>')
		},
hellldrs: function(target, room, user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<font size="4"><b>Hell Gym Leaders:</b></font><br\><br\>' +
                '<font color="#808080"><font size="2"><b>Gym Ldr. ???:</b></font> Type - Normal<br\>' +
                '<font color="#FF0000"><font size="2"><b>Gym Ldr. Zanryu:</b></font> Type - Fire<br\>' +
                '<font color="#0000FF"><font size="2"><b>Gym Ldr. K0TS:</b></font> Type - Water<br\>' +
                '<font color="#e9c900"><font size="2"><b>Gym Ldr. Spasm:</b></font> Type - Electric<br\>' +
                '<font color="#008000"><font size="2"><b>Gym Ldr. Wrath:</b></font> Type - Grass<br\>' +
                '<font color="#017f8a"><font size="2"><b>Gym Ldr. ???:</b></font> Type - Ice<br\>' +
                '<font color="#ea7500"><font size="2"><b>Gym Ldr. Reaper:</b></font> Type - Fighting<br\>' +
                '<font color="#800080"><font size="2"><b>Gym Ldr. Lizard:</b></font> Type - Poison<br\>' +
                '<font color="#A52A2A"><font size="2"><b>Gym Ldr. Asce:</b></font> Type - Ground<br\>' +
                '<font color="#00adf1"><font size="2"><b>Gym Ldr. CK:</b></font> Type - Flying<br\>' +
                '<font color="#FF00FF"><font size="2"><b>Gym Ldr. ???:</b></font> Type - Psychic<br\>' +
                '<font color="#00b818"><font size="2"><b>Gym Ldr. Ortex:</b></font> Type - Bug<br\>' +
                '<font color="#6a4f3d"><font size="2"><b>Gym Ldr. ???:</b></font> Type - Rock<br\>' +
                '<font color="#9370DB"><font size="2"><b>Gym Ldr. Hipi:</b></font> Type - Ghost<br\>' +
                '<font color="#6A5ACD"><font size="2"><b>Gym Ldr. Tigrex:</b></font> Type - Dragon<br\>' +
                '<font color="#000000"><font size="2"><b>Gym Ldr. Vain:</b></font> Type - Dark<br\>' +
                '<font color="#6d6d6d"><font size="2"><b>Gym Ldr. Frank:</b></font> Type - Steel<br\>' +
                '<font color="#ea009f"><font size="2"><b>Gym Ldr. ???:</b></font> Type - Fairy<br\>' )
                },
helle4: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<font size="4"><b>Hell Elite Four:</b></font><br\>' +
                '<font color="#000000"><font size="2"><b>Elite Four Lando:</b></font> Type - Dark<br\>' +
                '<font color="#0000FF"><font size="2"><b>Elite Four Kyo:</b></font> Type - Water<br\>' +
'<font color="#808080"><font size="2"><b>Elite Four Zeall:</b></font> Type - Normal<br\>' +
 '<font color="#00adf1"><font size="2"><b>Elite Four Entalp:</b></font> Type - Flying <br\><br\>' +
            '<font color="#000000"><font size="4"><b>Hell Champion:</b></font><br\>' +
                '<font color="#A52A2A"><font size="3"><b>Champion Maxerus:</b></font> Type - Ground<br\>')
		},
	challengerinfo: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<font size="6"><b>Challenger Information</b></font><br />' +
		'To challenge the league you must register your team via the /registerteam command, listing your 6 pokemon.<br />' +
		'Example: /registerteam ProteanShakes, Deoxys-S, Crawdaunt, Landorus, Lucario, Manidibuzz, Slowbro.<br />' +
		'When you have registered your team you may begin challenging gym leaders, though you may not change teams.<br />' +
		'Once you have collected 14 badges you may select and Elite Four path to challenge.<br />' +
		'Upon defeating a champion, you will be added to the hall of fame, which can be viewed via /halloffame.<br />' +
		'If you have any questions, PM any E4 and they should be able to assist you.<br />' +
		'Thank you for reading this and not spamming chat with questions.<br />' +
		'<font size="3">~Biblia Community</font')
		},
	/*********************************************************
	 * Miscellaneous commands
	 *********************************************************/
registerteam: function(target, room, user)
{if (target.indexOf(',') != -1)	{
	var pokemonF = 0;	var teamRegister = user.userid;	var parts = target.split(',');
	var pokemonA = parts[0];	var pokemonB = parts[1];	var pokemonC = parts[2];	var pokemonD = parts[3];	var pokemonE = parts[4];	var pokemonF = parts[5]};	if (pokemonF === 0) {return this.sendReply ('Please enter six Pokemon.')} else {var log = fs.createWriteStream('config/teams.csv', {'flags': 'a'});
			log.write("\n" + teamRegister + ':' + pokemonA + ', ' + pokemonB + ', ' + pokemonC + ', ' + pokemonD + ', ' + pokemonE + ':' + pokemonF);	this.sendReply(user.name + ' registered the team of ' +  pokemonA + ', ' + pokemonB + ', ' + pokemonC + ', ' + pokemonD + ', ' + pokemonE + ', and ' + pokemonF)} 
			},
        
afk: 'away',
	away : function (target, room, user, connection) {
		if (!this.can('lock')) return false;

		if (!user.isAway) {
			var originalName = user.name;
			var awayName = user.name + ' - Away';
			//delete the user object with the new name in case it exists - if it does it can cause issues with forceRename
			delete Users.get(awayName);
			user.forceRename(awayName, undefined, true);
			
			this.add('|raw|-- <b><font color="#4F86F7">' + originalName +'</font color></b> is now away. '+ (target ? " (" + target + ")" : ""));

			user.isAway = true;
		}
		else {
			return this.sendReply('You are already set as away, type /back if you are now back');
		}

		user.updateIdentity();
	},
	back: function(target, room, user, connection) {
		if (!this.can('lock')) return false;

		if (user.isAway) {

			var name = user.name;

			var newName = name.substr(0, name.length - 7);
			
			//delete the user object with the new name in case it exists - if it does it can cause issues with forceRename
			delete Users.get(newName);

			user.forceRename(newName, undefined, true);
			
			//user will be authenticated
			user.authenticated = true;
			
			this.add('|raw|-- <b><font color="#4F86F7">' + newName + '</font color></b> is no longer away');

			user.isAway = false;
		}
		else {
			return this.sendReply('You are not set as away');
		}

		user.updateIdentity();
	},
	peekaboo: 'hideauth',
	hide: 'hideauth',
	hideauth: function(target, room, user){
		if(!user.can('hideauth'))
			return this.sendReply( '/hideauth - access denied.');

		var tar = ' ';
		if(target){
			target = target.trim();
			if(config.groupsranking.indexOf(target) > -1){
				if( config.groupsranking.indexOf(target) <= config.groupsranking.indexOf(user.group)){
					tar = target;
				}else{
					this.sendReply('The group symbol you have tried to use is of a higher authority than you have access to. Defaulting to \' \' instead.');
				}
			}else{
				this.sendReply('You have tried to use an invalid character as your auth symbol. Defaulting to \' \' instead.');
			}
		}

		user.getIdentity = function(){
			if(this.muted)
				return '!' + this.name;
			if(this.locked)
				return '#' + this.name;
			return tar + this.name;
		};
		user.updateIdentity();
		this.sendReply( 'You are now hiding your auth symbol as \''+tar+ '\'.');
		return this.logModCommand(user.name + ' is hiding auth symbol as \''+ tar + '\'');
	},

	showauth: function(target, room, user){
		if(!user.can('hideauth'))
			return	this.sendReply( '/showauth - access denied.');

		delete user.getIdentity;
		user.updateIdentity();
		this.sendReply('You have now revealed your auth symbol.');
		return this.logModCommand(user.name + ' has revealed their auth symbol.');
	}, 
	birkal: function(target, room, user) {
		this.sendReply("It's not funny anymore.");
	},

	potd: function(target, room, user) {
		if (!this.can('potd')) return false;

		config.potd = target;
		Simulator.SimulatorProcess.eval('config.potd = \''+toId(target)+'\'');
		if (target) {
			if (Rooms.lobby) Rooms.lobby.addRaw('<div class="broadcast-blue"><b>The Pokemon of the Day is now '+target+'!</b><br />This Pokemon will be guaranteed to show up in random battles.</div>');
			this.logModCommand('The Pokemon of the Day was changed to '+target+' by '+user.name+'.');
		} else {
			if (Rooms.lobby) Rooms.lobby.addRaw('<div class="broadcast-blue"><b>The Pokemon of the Day was removed!</b><br />No pokemon will be guaranteed in random battles.</div>');
			this.logModCommand('The Pokemon of the Day was removed by '+user.name+'.');
		}
	},

	roll: 'dice',
	dice: function(target, room, user) {
		if (!this.canBroadcast()) return;
		var d = target.indexOf("d");
		if (d != -1) {
			var num = parseInt(target.substring(0,d));
			faces = NaN;
			if (target.length > d) var faces = parseInt(target.substring(d + 1));
			if (isNaN(num)) num = 1;
			if (isNaN(faces)) return this.sendReply("The number of faces must be a valid integer.");
			if (faces < 1 || faces > 1000) return this.sendReply("The number of faces must be between 1 and 1000");
			if (num < 1 || num > 20) return this.sendReply("The number of dice must be between 1 and 20");
			var rolls = new Array();
			var total = 0;
			for (var i=0; i < num; i++) {
				rolls[i] = (Math.floor(faces * Math.random()) + 1);
				total += rolls[i];
			}
			return this.sendReplyBox('Random number ' + num + 'x(1 - ' + faces + '): ' + rolls.join(', ') + '<br />Total: ' + total);
		}
		if (target && isNaN(target) || target.length > 21) return this.sendReply('The max roll must be a number under 21 digits.');
		var maxRoll = (target)? target : 6;
		var rand = Math.floor(maxRoll * Math.random()) + 1;
		return this.sendReplyBox('Random number (1 - ' + maxRoll + '): ' + rand);
	},

	register: function() {
		if (!this.canBroadcast()) return;
		this.sendReply("You must win a rated battle to register.");
	},

	br: 'banredirect',
	banredirect: function(){
		this.sendReply('/banredirect - This command is obsolete and has been removed.');
	},

	lobbychat: function(target, room, user, connection) {
		if (!Rooms.lobby) return this.popupReply("This server doesn't have a lobby.");
		target = toId(target);
		if (target === 'off') {
			user.leaveRoom(Rooms.lobby, connection.socket);
			connection.send('|users|');
			this.sendReply('You are now blocking lobby chat.');
		} else {
			user.joinRoom(Rooms.lobby, connection);
			this.sendReply('You are now receiving lobby chat.');
		}
	},

	a: function(target, room, user) {
		if (!this.can('battlemessage')) return false;
		// secret sysop command
		room.add(target);
	},
	poof: 'd',
        d: function(target, room, user){
                if(room.id !== 'lobby') return false;
                var btags = '<strong><font color='+hashColor(Math.random().toString())+'" >';
                var etags = '</font></strong>'
                var targetid = toUserid(user);
                if(!user.muted && target){
                        var tar = toUserid(target);
                        var targetUser = Users.get(tar);
                        if(user.can('poof', targetUser)){
 
                                if(!targetUser){
                                        user.emit('console', 'Cannot find user ' + target + '.', socket);
                                }else{
                                        if(poofeh)
                                                Rooms.rooms.lobby.addRaw(btags + '~~ '+targetUser.name+' was knifed by  ' + user.name +'! ~~' + etags);
                                        targetUser.disconnectAll();
                                        return        this.logModCommand(targetUser.name+ ' was poofed by ' + user.name);
                                }
 
                        } else {
                                return this.sendReply('/poof target - Access denied.');
                        }
                }
                if(poofeh && !user.muted){
                        Rooms.rooms.lobby.addRaw(btags + getRandMessage(user)+ etags);
                        user.disconnectAll();
                }else{
                        return this.sendReply('poof is currently disabled.');
                }
        },
 
        poofoff: 'nopoof',
        nopoof: function(target, room, user){
                if(!user.can('warn'))
                        return this.sendReply('/nopoof - Access denied.');
                if(!poofeh)
                        return this.sendReply('poof is currently disabled.');
                poofeh = false;
                return this.sendReply('poof is now disabled.');
        },
 
        poofon: function(target, room, user){
                if(!user.can('warn'))
                        return this.sendReply('/poofon - Access denied.');
                if(poofeh)
                        return this.sendReply('poof is currently enabled.');
                poofeh = true;
                return this.sendReply('poof is now enabled.');
        },
 
        cpoof: function(target, room, user){
                if(!user.can('broadcast'))
                        return this.sendReply('/cpoof - Access Denied');
 
                if(poofeh)
                {
                        if(target.indexOf('<img') != -1)
                                return this.sendReply('Images are no longer supported in cpoof.');
                        target = htmlfix(target);
                        var btags = '<strong><font color="'+hashColor(Math.random().toString())+'" >';
                        var etags = '</font></strong>'
                        Rooms.rooms.lobby.addRaw(btags + '~~ '+user.name+' '+target+'! ~~' + etags);
                        this.logModCommand(user.name + ' used a custom poof message: \n "'+target+'"');
                        user.disconnectAll();
                }else{
                        return this.sendReply('Poof is currently disabled.');
                }
        },

	/*********************************************************
	 * Custom commands
	 *********************************************************/

	reminders: 'reminder',
	reminder: function(target, room, user) {
		if (room.type !== 'chat') return this.sendReply("This command can only be used in chatrooms.");

		var parts = target.split(',');
		var cmd = parts[0].trim().toLowerCase();

		if (cmd in {'':1, show:1, view:1, display:1}) {
			if (!this.canBroadcast()) return;
			message = "<strong><font size=\"3\">Reminders for " + room.title + ":</font></strong>";
			if (room.reminders && room.reminders.length > 0)
				message += '<ol><li>' + room.reminders.join('</li><li>') + '</li></ol>';
			else
				message += "<br /><br />There are no reminders to display";
			message += "Contact a room owner, leader, or admin if you have a reminder you would like added.";
			return this.sendReplyBox(message);
		}

		if (!this.can('declare', null, room)) return false;
		if (!room.reminders) room.reminders = room.chatRoomData.reminders = [];

		var index = parseInt(parts[1], 10) - 1;
		var message = parts.slice(2).join(',').trim();
		switch (cmd) {
			case 'add':
				index = room.reminders.length;
				message = parts.slice(1).join(',').trim();
				// Fallthrough

			case 'insert':
				if (!message) return this.sendReply("Your reminder was empty.");
				if (message.length > 250) return this.sendReply("Your reminder cannot be greater than 250 characters in length.");

				room.reminders.splice(index, 0, message);
				Rooms.global.writeChatRoomData();
				return this.sendReply("Your reminder has been inserted.");

			case 'edit':
				if (!room.reminders[index]) return this.sendReply("There is no such reminder.");
				if (!message) return this.sendReply("Your reminder was empty.");
				if (message.length > 250) return this.sendReply("Your reminder cannot be greater than 250 characters in length.");

				room.reminders[index] = message;
				Rooms.global.writeChatRoomData();
				return this.sendReply("The reminder has been modified.");

			case 'delete':
				if (!room.reminders[index]) return this.sendReply("There is no such reminder.");

				this.sendReply(room.reminders.splice(index, 1)[0]);
				Rooms.global.writeChatRoomData();
				return this.sendReply("has been deleted from the reminders.");
		}
	},

	/*********************************************************
	 * Help commands
	 *********************************************************/

	commands: 'help',
	h: 'help',
	'?': 'help',
	help: function(target, room, user) {
		target = target.toLowerCase();
		var matched = false;
		if (target === 'all' || target === 'msg' || target === 'pm' || target === 'whisper' || target === 'w') {
			matched = true;
			this.sendReply('/msg OR /whisper OR /w [username], [message] - Send a private message.');
		}
		if (target === 'all' || target === 'r' || target === 'reply') {
			matched = true;
			this.sendReply('/reply OR /r [message] - Send a private message to the last person you received a message from, or sent a message to.');
		}
		if (target === 'all' || target === 'getip' || target === 'ip') {
			matched = true;
			this.sendReply('/ip - Get your own IP address.');
			this.sendReply('/ip [username] - Get a user\'s IP address. Requires: @ & ~');
		}
		if (target === 'all' || target === 'rating' || target === 'ranking' || target === 'rank' || target === 'ladder') {
			matched = true;
			this.sendReply('/rating - Get your own rating.');
			this.sendReply('/rating [username] - Get user\'s rating.');
		}
		if (target === 'all' || target === 'nick') {
			matched = true;
			this.sendReply('/nick [new username] - Change your username.');
		}
		if (target === 'all' || target === 'avatar') {
			matched = true;
			this.sendReply('/avatar [new avatar number] - Change your trainer sprite.');
		}
		if (target === 'all' || target === 'rooms') {
			matched = true;
			this.sendReply('/rooms [username] - Show what rooms a user is in.');
		}
		if (target === 'all' || target === 'whois') {
			matched = true;
			this.sendReply('/whois [username] - Get details on a username: group, and rooms.');
		}
		if (target === 'all' || target === 'data') {
			matched = true;
			this.sendReply('/data [pokemon/item/move/ability] - Get details on this pokemon/item/move/ability.');
			this.sendReply('!data [pokemon/item/move/ability] - Show everyone these details. Requires: + % @ & ~');
		}
		if (target === "all" || target === 'analysis') {
			matched = true;
			this.sendReply('/analysis [pokemon], [generation] - Links to the Smogon University analysis for this Pokemon in the given generation.');
			this.sendReply('!analysis [pokemon], [generation] - Shows everyone this link. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'groups') {
			matched = true;
			this.sendReply('/groups - Explains what the + % @ & next to people\'s names mean.');
			this.sendReply('!groups - Show everyone that information. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'opensource') {
			matched = true;
			this.sendReply('/opensource - Links to PS\'s source code repository.');
			this.sendReply('!opensource - Show everyone that information. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'avatars') {
			matched = true;
			this.sendReply('/avatars - Explains how to change avatars.');
			this.sendReply('!avatars - Show everyone that information. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'intro') {
			matched = true;
			this.sendReply('/intro - Provides an introduction to competitive pokemon.');
			this.sendReply('!intro - Show everyone that information. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'cap') {
			matched = true;
			this.sendReply('/cap - Provides an introduction to the Create-A-Pokemon project.');
			this.sendReply('!cap - Show everyone that information. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'om') {
			matched = true;
			this.sendReply('/om - Provides links to information on the Other Metagames.');
			this.sendReply('!om - Show everyone that information. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'learn' || target === 'learnset' || target === 'learnall') {
			matched = true;
			this.sendReply('/learn [pokemon], [move, move, ...] - Displays how a Pokemon can learn the given moves, if it can at all.')
			this.sendReply('!learn [pokemon], [move, move, ...] - Show everyone that information. Requires: + % @ & ~')
		}
		if (target === 'all' || target === 'calc' || target === 'caclulator') {
			matched = true;
			this.sendReply('/calc - Provides a link to a damage calculator');
			this.sendReply('!calc - Shows everyone a link to a damage calculator. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'faq') {
			matched = true;
			this.sendReply('/faq [theme] - Provides a link to the FAQ. Add deviation, doubles, randomcap, restart, or staff for a link to these questions. Add all for all of them.');
			this.sendReply('!faq [theme] - Shows everyone a link to the FAQ. Add deviation, doubles, randomcap, restart, or staff for a link to these questions. Add all for all of them. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'highlight') {
			matched = true;
			this.sendReply('Set up highlights:');
			this.sendReply('/highlight add, word - add a new word to the highlight list.');
			this.sendReply('/highlight list - list all words that currently highlight you.');
			this.sendReply('/highlight delete, word - delete a word from the highlight list.');
			this.sendReply('/highlight delete - clear the highlight list');
		}
		if (target === 'all' || target === 'timestamps') {
			matched = true;
			this.sendReply('Set your timestamps preference:');
			this.sendReply('/timestamps [all|lobby|pms], [minutes|seconds|off]');
			this.sendReply('all - change all timestamps preferences, lobby - change only lobby chat preferences, pms - change only PM preferences');
			this.sendReply('off - set timestamps off, minutes - show timestamps of the form [hh:mm], seconds - show timestamps of the form [hh:mm:ss]');
		}
		if (target === 'all' || target === 'effectiveness') {
			matched = true;
			this.sendReply('/effectiveness [type1], [type2] - Provides the effectiveness of a [type1] attack to a [type2] Pokémon.');
			this.sendReply('!effectiveness [type1], [type2] - Shows everyone the effectiveness of a [type1] attack to a [type2] Pokémon.');
		}
		if (target === 'all' || target === 'dexsearch') {
			matched = true;
			this.sendReply('/dexsearch [type], [move], [move], ... - Searches for Pokemon that fulfill the selected criteria.');
			this.sendReply('Search categories are: type, tier, color, moves, ability, gen.');
			this.sendReply('Valid colors are: green, red, blue, white, brown, yellow, purple, pink, gray and black.');
			this.sendReply('Valid tiers are: Uber/OU/BL/UU/BL2/RU/NU/NFE/LC/CAP.');
			this.sendReply('Types must be followed by " type", e.g., "dragon type".');
			this.sendReply('The order of the parameters does not matter.');
		}
		if (target === 'all' || target === 'dice' || target === 'roll') {
			matched = true;
			this.sendReply('/dice [optional max number] - Randomly picks a number between 1 and 6, or between 1 and the number you choose.');
			this.sendReply('/dice [number of dice]d[number of sides] - Simulates rolling a number of dice, e.g., /dice 2d4 simulates rolling two 4-sided dice.');
		}
		if (target === 'all' || target === 'join') {
			matched = true;
			this.sendReply('/join [roomname] - Attempts to join the room [roomname].');
		}
		if (target === 'all' || target === 'ignore') {
			matched = true;
			this.sendReply('/ignore [user] - Ignores all messages from the user [user].');
			this.sendReply('Note that staff messages cannot be ignored.');
		}
		if (target === '%' || target === 'invite') {
			matched = true;
			this.sendReply('/invite [username], [roomname] - Invites the player [username] to join the room [roomname].');
		}
		if (target === '%' || target === 'roomban') {
			matched = true;
			this.sendReply('/roomban [username] - Bans the user from the room you are in. Requires: % @ & ~');
		}
		if (target === '%' || target === 'roomunban') {
			matched = true;
			this.sendReply('/roomunban [username] - Unbans the user from the room you are in. Requires: % @ & ~');
		}
		if (target === '%' || target === 'redirect' || target === 'redir') {
			matched = true;
			this.sendReply('/redirect or /redir [username], [roomname] - Attempts to redirect the user [username] to the room [roomname]. Requires: % @ & ~');
		}
		if (target === '%' || target === 'modnote') {
			matched = true;
			this.sendReply('/modnote [note] - Adds a moderator note that can be read through modlog. Requires: % @ & ~');
		}
		if (target === '%' || target === 'altcheck' || target === 'alt' || target === 'alts' || target === 'getalts') {
			matched = true;
			this.sendReply('/alts OR /altcheck OR /alt OR /getalts [username] - Get a user\'s alts. Requires: % @ & ~');
		}
		if (target === '%' || target === 'forcerename' || target === 'fr') {
			matched = true;
			this.sendReply('/forcerename OR /fr [username], [reason] - Forcibly change a user\'s name and shows them the [reason]. Requires: % @ & ~');
		}
		if (target === '@' || target === 'ban' || target === 'b') {
			matched = true;
			this.sendReply('/ban OR /b [username], [reason] - Kick user from all rooms and ban user\'s IP address with reason. Requires: @ & ~');
		}
		if (target === '&' || target === 'banip') {
			matched = true;
			this.sendReply('/banip [ip] - Kick users on this IP or IP range from all rooms and bans it. Accepts wildcards to ban ranges. Requires: & ~');
		}
		if (target === '@' || target === 'unban') {
			matched = true;
			this.sendReply('/unban [username] - Unban a user. Requires: @ & ~');
		}
		if (target === '@' || target === 'unbanall') {
			matched = true;
			this.sendReply('/unbanall - Unban all IP addresses. Requires: @ & ~');
		}
		if (target === '%' || target === 'modlog') {
			matched = true;
			this.sendReply('/modlog [roomid|all], [n] - Roomid defaults to current room. If n is a number or omitted, display the last n lines of the moderator log. Defaults to 15. If n is not a number, search the moderator log for "n" on room\'s log [roomid]. If you set [all] as [roomid], searches for "n" on all rooms\'s logs. Requires: % @ & ~');
		}
		if (target === "%" || target === 'kickbattle ') {
			matched = true;
			this.sendReply('/kickbattle [username], [reason] - Kicks an user from a battle with reason. Requires: % @ & ~');
		}
		if (target === "%" || target === 'warn' || target === 'k') {
			matched = true;
			this.sendReply('/warn OR /k [username], [reason] - Warns a user showing them the Pokemon Showdown Rules and [reason] in an overlay. Requires: % @ & ~');
		}
		if (target === '%' || target === 'mute' || target === 'm') {
			matched = true;
			this.sendReply('/mute OR /m [username], [reason] - Mute user with reason for 7 minutes. Requires: % @ & ~');
		}
		if (target === '%' || target === 'hourmute' || target === 'hm') {
			matched = true;
			this.sendReply('/hourmute OR /hm [username], [reason] - Mute user with reason for an hour. Requires: % @ & ~');
		}
		if (target === '%' || target === 'daymute' || target === 'dm') {
			matched = true;
			this.sendReply('/daymute OR /dm [username], [reason] - Mute user with reason for a day. Requires: % @ & ~');
		}
		if (target === '%' || target === 'unmute') {
			matched = true;
			this.sendReply('/unmute [username] - Remove mute from user. Requires: % @ & ~');
		}
		if (target === '&' || target === 'promote') {
			matched = true;
			this.sendReply('/promote [username], [group] - Promotes the user to the specified group or next ranked group. Requires: & ~');
		}
		if (target === '&' || target === 'demote') {
			matched = true;
			this.sendReply('/demote [username], [group] - Demotes the user to the specified group or previous ranked group. Requires: & ~');
		}
		if (target === '~' || target === 'forcerenameto' || target === 'frt') {
			matched = true;
			this.sendReply('/forcerenameto OR /frt [username] - Force a user to choose a new name. Requires: & ~');
			this.sendReply('/forcerenameto OR /frt [username], [new name] - Forcibly change a user\'s name to [new name]. Requires: & ~');
		}
		if (target === '&' || target === 'forcetie') {
			matched = true;
			this.sendReply('/forcetie - Forces the current match to tie. Requires: & ~');
		}
		if (target === '&' || target === 'declare') {
			matched = true;
			this.sendReply('/declare [message] - Anonymously announces a message. Requires: & ~');
		}
		if (target === '~' || target === 'chatdeclare' || target === 'cdeclare') {
			matched = true;
			this.sendReply('/cdeclare [message] - Anonymously announces a message to all chatrooms on the server. Requires: ~');
		}
		if (target === '~' || target === 'globaldeclare' || target === 'gdeclare') {
			matched = true;
			this.sendReply('/globaldeclare [message] - Anonymously announces a message to every room on the server. Requires: ~');
		}
		if (target === '%' || target === 'announce' || target === 'wall') {
			matched = true;
			this.sendReply('/announce OR /wall [message] - Makes an announcement. Requires: % @ & ~');
		}
		if (target === '@' || target === 'modchat') {
			matched = true;
			this.sendReply('/modchat [off/autoconfirmed/+/%/@/&/~] - Set the level of moderated chat. Requires: @ for off/autoconfirmed/+ options, & ~ for all the options');
		}
		if (target === '~' || target === 'hotpatch') {
			matched = true;
			this.sendReply('Hot-patching the game engine allows you to update parts of Showdown without interrupting currently-running battles. Requires: ~');
			this.sendReply('Hot-patching has greater memory requirements than restarting.');
			this.sendReply('/hotpatch chat - reload chat-commands.js');
			this.sendReply('/hotpatch battles - spawn new simulator processes');
			this.sendReply('/hotpatch formats - reload the tools.js tree, rebuild and rebroad the formats list, and also spawn new simulator processes');
		}
		if (target === '~' || target === 'lockdown') {
			matched = true;
			this.sendReply('/lockdown - locks down the server, which prevents new battles from starting so that the server can eventually be restarted. Requires: ~');
		}
		if (target === '~' || target === 'kill') {
			matched = true;
			this.sendReply('/kill - kills the server. Can\'t be done unless the server is in lockdown state. Requires: ~');
		}
		if (target === '~' || target === 'loadbanlist') {
			matched = true;
			this.sendReply('/loadbanlist - Loads the bans located at ipbans.txt. The command is executed automatically at startup. Requires: ~');
		}
		if (target === '~' || target === 'makechatroom') {
			matched = true;
			this.sendReply('/makechatroom [roomname] - Creates a new room named [roomname]. Requires: ~');
		}
		if (target === '~' || target === 'deregisterchatroom') {
			matched = true;
			this.sendReply('/deregisterchatroom [roomname] - Deletes room [roomname] after the next server restart. Requires: ~');
		}
		if (target === '~' || target === 'roomowner') {
			matched = true;
			this.sendReply('/roomowner [username] - Appoints [username] as a room owner. Removes official status. Requires: ~');
		}
		if (target === '~' || target === 'roomdeowner') {
			matched = true;
			this.sendReply('/roomdeowner [username] - Removes [username]\'s status as a room owner. Requires: ~');
		}
		if (target === '~' || target === 'privateroom') {
			matched = true;
			this.sendReply('/privateroom [on/off] - Makes or unmakes a room private. Requires: ~');
		}
		if (target === 'all' || target === 'help' || target === 'h' || target === '?' || target === 'commands') {
			matched = true;
			this.sendReply('/help OR /h OR /? - Gives you help.');
		}
		if (!target) {
			this.sendReply('COMMANDS: /msg, /reply, /ignore, /ip, /rating, /nick, /avatar, /rooms, /whois, /help, /away, /back, /timestamps, /highlight');
			this.sendReply('INFORMATIONAL COMMANDS: /data, /dexsearch, /groups, /opensource, /avatars, /faq, /rules, /intro, /tiers, /othermetas, /learn, /analysis, /calc (replace / with ! to broadcast. (Requires: + % @ & ~))');
			this.sendReply('For details on all room commands, use /roomhelp');
			this.sendReply('For details on all commands, use /help all');
			if (user.group !== config.groupsranking[0]) {
				this.sendReply('DRIVER COMMANDS: /mute, /unmute, /announce, /modlog, /forcerename, /alts')
				this.sendReply('MODERATOR COMMANDS: /ban, /unban, /unbanall, /ip, /redirect, /kick');
				this.sendReply('LEADER COMMANDS: /promote, /demote, /forcewin, /forcetie, /declare');
				this.sendReply('For details on all moderator commands, use /help @');
			}
			this.sendReply('For details of a specific command, use something like: /help data');
		} else if (!matched) {
			this.sendReply('The command "/'+target+'" was not found. Try /help for general help');
		}
 if (target === 'all' || target === 'blockchallenges' || target === 'idle') {
                        matched = true;
                        this.sendReply('/away - Blocks challenges so no one can challenge you. Deactivate it with /back.');
                }
                if (target === 'all' || target === 'allowchallenges') {
                        matched = true;
                        this.sendReply('/back - Unlocks challenges so you can be challenged again. Deactivate it with /away.');
               }
	},

};
function getRandMessage(user){
	var numMessages = 34; // numMessages will always be the highest case # + 1 //increasing this will make the default appear more often
	var message = '~~ ';
	switch(Math.floor(Math.random()*numMessages)){
		case 0: message = message + user.name + ' got spanked too hard by BrittleWind!';
		break;
		case 1: message = message + user.name + ' challenged the Biblia League';
		break;
		case 2: message = message + user.name + ' used Explosion!';
		break;
		case 3: message = message + user.name + ' was swallowed up by the Earth!';
		break;
		case 4: message = message + user.name + ' made the Scarf angry!';
		break;	
		case 5: message = message + user.name + ' tango\'d with the Lando!';
		break;
		case 6: message = message + user.name + ' was sucker punched by Absol!';
		break;
		case 7: message = message + user.name + ' has left the building.';
		break;
		case 8: message = message + user.name + ' got smacked by Epin!';
		break;
		case 9: message = message + user.name + ' left for their lover!';
		break;
		case 10: message = message + user.name + ' was sent to the Hell faction';
		break;
		case 11: message = message + user.name + ' was hit by Magikarp\'s Revenge!';
		break;
		case 12: message = message + user.name + ' was sucked into a whirlpool!';
		break;
		case 13: message = message + user.name + ' got scared and left the server!';
		break;
		case 14: message = message + user.name + ' went into a cave without a repel!';
		break;
		case 15: message = message + user.name + ' got eaten by a bunch of piranhas!';
		break;
		case 16: message = message + user.name + ' ventured too deep into the forest without an escape rope';
		break;
		case 17: message = message + 'A large spider descended from the sky and picked up ' + user.name + '.';
		break;
		case 18: message = message + user.name + ' lost in Heaven';
		break;
		case 19: message = message + user.name + ' woke up an angry Snorlax!';
		break;
		case 20: message = message + user.name + ' was dramatically killed by a chicken!'; //huehue
		break;
		case 21: message = message + user.name + ' was used as shark bait!';
		break;
		case 22: message = message + user.name + ' peered through the hole on Shedinja\'s back';
		break;
		case 23: message = message + user.name + ' received judgment from the almighty Arceus!';
		break;
		case 24: message = message + user.name + ' used Final Gambit and missed!';
		break;
		case 25: message = message + user.name + ' went into grass without any pokemon!';
		break;
		case 26: message = message + user.name + ' made a Slowbro angry!';
		break;
		case 27: message = message + user.name + ' died by Maxy\'s generousity ;n;!';
		break;
		case 28: message = message + user.name + ' got lost in the illusion of reality.';
		break;
		case 29: message = message + user.name + ' ate a bomb!';
		break;
		case 30: message = message + 'SOMEbody accidentally roomownered ' + user.name + ' !';
		break;
		case 31: message = message + user.name + ' left for a timeout!';
		break;
		case 32: message = message + user.name + ' fell into a snake pit!'; //huehuehue how long until someone notices
		break;
		case 33: message = message + user.name + ' got eaten by sharks!';
		break;
		default: message = message + user.name + ' bought a poisoned Coke!';
	};
	message = message + ' ~~';
	return message;
}
