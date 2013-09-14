// ==UserScript==
// @name           GameFAQs "Remove Friend" Button
// @namespace      OTACON120
// @author         OTACON120
// @version        1.0
// @description    Adds a button to allow one-click friend removal on GameFAQs friend lists
// @updateURL      http://userscripts.org/scripts/source/131602.meta.js
// @downloadURL    http://userscripts.org/scripts/source/131602.user.js
// @website        http://otacon120.com/user-scripts/gamefaqs-related/remove-friend-button/
// @include        http://www.gamefaqs.com/boards/friends
// @include        http://www.gamefaqs.com/boards/friends?list=friends*
// @include        http://www.gamefaqs.com/boards/friends?list=requested*
// @include        http://www.gamefaqs.com/boards/friends?list=watching*
// @include        http://www.gamefaqs.com/boards/friends?list=following*
// @match          http://www.gamefaqs.com/boards/friends
// @match          http://www.gamefaqs.com/boards/friends?list=friends*
// @match          http://www.gamefaqs.com/boards/friends?list=requested*
// @match          http://www.gamefaqs.com/boards/friends?list=watching*
// @match          http://www.gamefaqs.com/boards/friends?list=following*
// ==/UserScript==

function getListName(name) {
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]" + name + "=([^&#]*)",
		regex = new RegExp(regexS),
		results = regex.exec(window.location.href);

	if (results == null) {
		return "";
	} else {
		return results[1];
	}
}

var listName = (getListName('list') != "" ? getListName('list') : 'friends'),
	listTables = document.getElementById('main_col').getElementsByClassName('help'),
	i,
	f,
	buttonTitle,
	removeFriendButton = [],
	buttonCSS = document.createElement('style'),
	formKey = document.getElementById('side_col').getElementsByClassName('details')[2].getElementsByTagName('input')[0].value;

buttonCSS.textContent = '.remove_friend_button {display: inline-block;} .remove_friend_button input {background: transparent; border: none; color: #F00; padding: 0; margin: 0 0 0 5px; cursor: pointer; vertical-align: text-bottom;}';

document.head.appendChild(buttonCSS);
	
for (i = 0; i < listTables.length; i++) {
	var friendRow = listTables[i].getElementsByTagName('tr');

	for (f = 0; f < friendRow.length; f++) {
		var friend = friendRow[f].getElementsByTagName('td')[0].textContent;

		switch (listName) {
			case 'friends':
				buttonTitle = 'Remove ' + friend + ' from Friends';
				break;

			case 'requested':
				buttonTitle = 'Remove ' + friend + ' from Acquaintances';
				break;

			case 'watching':
				buttonTitle = 'Stop watching ' + friend;
				break;

			case 'following':
				buttonTitle = 'Stop following ' + friend;
				break;
		}
		removeFriendButton[f] = document.createElement('form');
		removeFriendButton[f].method = 'post';
		removeFriendButton[f].action = '/boards/friends?list=' + listName + '&action=remove';
		removeFriendButton[f].className = 'remove_friend_button';
		removeFriendButton[f].innerHTML = '<input type="hidden" value="' + formKey + '" name="key"/><input type="hidden" value="' + friend + '" name="username"/><input type="submit" value="&#215;" title="' + buttonTitle + '"/>';
		friendRow[f].getElementsByTagName('td')[0].appendChild(removeFriendButton[f]);
	}
}