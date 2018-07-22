var skillvideo;
var skilldesc;
var SRC_SUFFIX = "showinfo=0&enablejsapi=1&version=3&playerapiid=ytplayer";
var SRC_URLS = [];

var SKILL_NAMES = ["Spearhead", "Sideswipe", "Axeheave", "Bladereap", 
				   "Iron Will", "Smoldering Rage", "Gilded Resolve", "Tempered Fury",
				   "Daze", "Cripple", "Shatter", "Bleed",
				   "Spellward", "Spellblade", "Spellbind", "Spellthief",
				   
				   "Flame Shot", "Flame Breath", "Flame Focus", "Flame Burst",
				   "Healing Balm", "Blinding Brew", "Frost Flask", "Toxic Tonic",
				   "Blaze Leap", "Blaze Smash", "Blaze Shells", "Blaze Rocket",
				   "Hooked Whip", "Ignited Whip", "Spiked Whip", "Barbed Whip",
				   
				   "Smoke Bomb", "Webbing Spray", "Arrow Spray", "Kinetic Bomb",
				   "Blade Rush", "Blade Mist", "Blade Whirlwind", "Blade Lightning",
				   "Shade Stealth", "Shade Illusion", "Shade Deception", "Shade Mirage",
				   "Umbra Shift", "Umbra Mark", "Umbra Bind", "Umbra Soul",
				   
				   "Primal Howl", "Menacing Growl", "Dragon Roar", "Ender Call",
				   "Spine Shield", "Spirit Shield", "Kinetic Shield", "Mirror Shield",
				   "Crushing Fist", "Smashing Fist", "Rending Fist", "Pounding Fist",
				   "Healing Totem", "Cloaking Totem", "Sating Totem", "Blood Totem",
				   
				   "Caustic Bomb", "Corrupting Bomb", "Splitting Bomb", "Shrouding Bomb",
				   "Wither Barrage", "Seeker Skull", "Skull Triad", "Wither Storm",
				   "Ghost Grip", "Eldritch Eye", "Black Blast", "Darkspark",
				   "Shadow Switch", "Shadow Trap", "Shadow Snare", "Shadow Shroud",
				   
				   "Haste", "Augment", "Recovery", "Redemption",
				   "Smite", "Judgement", "Arclight", "Soulflare",
				   "Ice Spray", "Freezing Water", "Suspension", "Glacial Guard",
				   "Holy Fire", "Purifying Fire", "Inferno", "Divine Fire"];
				   
var SKILL_DESCS = ["Thrust forward, dealing damage and Slowing all enemies in a line.", 
				   "Swipe twice in a forward semicircle, damaging and throwing enemies to the side.", 
				   "Channel briefly, then deal heavy damage and knock back enemies in a cone.", 
				   "A triple combo attack that slashes forward, uppercuts, then slams enemies into the ground.", 
				   
				   "For 8 seconds, damage from physical attacks is greatly reduced.", 
				   "For a short time, consecutive melee attacks increase in damage. If no damage dealt for 2 seconds, the buff is lost immediately.", 
				   "Gain an Absorption shield. Shield strength increases based on your missing health.", 
				   "For a short time, melee attacks drain health from enemies. Drain strength increases based on your missing health.",
				   
				   "Your next melee attack forces your target's field of view upwards.", 
				   "Your next melee attack applies Weakness and Hunger to the target.", 
				   "Your next melee attack removes all potion-type buffs from the enemy.", 
				   "Your next melee attack applies a bleed, dealing continuous damage and weakening the next healing effect on the target.",
				   
				   "Absorbs up to 3 magical (cold, ice, fire, light, dark, explosive) attacks. If all 3 blocks are used, gain a burst of Regeneration.",
				   "Absorbs up to 3 magical attacks. If all 3 blocks are used, your next melee attack applies a random powerful hostile effect (either hunger, poison, blind, or slow).", 
				   "Absorbs up to 3 magical attacks. If all 3 blocks are used, gain a large burst of Speed.", 
				   "Absorbs up to 3 magical attacks. If all 3 blocks are used, your next melee attack applies [Silence], placing all of your enemy's skills on a 20 second cooldown.",
				   
				   "Shoot a fireball that deals explosive damage and sets enemies on fire.", 
				   "Flame Breath", "Flame Focus", "Flame Burst",
				   "Healing Balm", "Blinding Brew", "Frost Flask", "Toxic Tonic",
				   "Blaze Leap", "Blaze Smash", "Blaze Shells", "Blaze Rocket",
				   "Hooked Whip", "Ignited Whip", "Spiked Whip", "Barbed Whip",
				   
				   "Smoke Bomb", "Webbing Spray", "Arrow Spray", "Kinetic Bomb",
				   "Blade Rush", "Blade Mist", "Blade Whirlwind", "Blade Lightning",
				   "Shade Stealth", "Shade Illusion", "Shade Deception", "Shade Mirage",
				   "Umbra Shift", "Umbra Mark", "Umbra Bind", "Umbra Soul",
				   
				   "Primal Howl", "Menacing Growl", "Dragon Roar", "Ender Call",
				   "Spine Shield", "Spirit Shield", "Kinetic Shield", "Mirror Shield",
				   "Crushing Fist", "Smashing Fist", "Rending Fist", "Pounding Fist",
				   "Healing Totem", "Cloaking Totem", "Sating Totem", "Blood Totem",
				   
				   "Caustic Bomb", "Corrupting Bomb", "Splitting Bomb", "Shrouding Bomb",
				   "Wither Barrage", "Seeker Skull", "Skull Triad", "Wither Storm",
				   "Ghost Grip", "Eldritch Eye", "Black Blast", "Darkspark",
				   "Shadow Switch", "Shadow Trap", "Shadow Snare", "Shadow Shroud",
				   
				   "Haste", "Augment", "Recovery", "Redemption",
				   "Smite", "Judgement", "Arclight", "Soulflare",
				   "Ice Spray", "Freezing Water", "Suspension", "Glacial Guard",
				   "Holy Fire", "Purifying Fire", "Inferno", "Divine Fire"];

$(document).ready(function () {
	/* Class icons */
	$(".classicon").each(function(index) {
		$(this).attr("myID", index+1);
	});
	$(".classicon").click(function() {
		showContent($(this).attr("myID"));
	});
	
	/* Skillmenu animation */
	$(".row.double").each(function() {
		$(this).find(".skillbox .row").each(function(i) {
			$(this).css("animation-delay", 0.1*i + "s");
			$(this).find(".skill").each(function(j) {
				$(this).css("animation-delay", (0.6 + 0.1*j) + "s");
			});
		});
	});
	/* Skill icons */
	$(".skill").each(function(index) {
		$(this).attr("myID", index);
		$(this).append("<span><p>" + SKILL_NAMES[index] + "</p></span>");
	});
	
	/* Tooltips */
	var tooltips = document.querySelectorAll('.skill span');

	window.onmousemove = function(event) {
		var x = (event.clientX + 16) + 'px',
			y = (event.clientY - 16) + 'px';
		for (var i = 0; i < tooltips.length; i++) {
			tooltips[i].style.top = y;
			tooltips[i].style.left = x;
		}
	};
	
	/* Open and close modal */
	var modal = document.getElementById('myModal');
	$(".close").click(function() {
		hideModal(modal);
	});
	window.onclick = function(event) {
		if (event.target == modal) {
			hideModal(modal);
		}
	};
	$(".skill").click(function() {
		displayModal(modal, $(this).attr("myID"));
	});
	/* Initialize modal content */
	skillvideo = $(".skillvideo");
	skilldesc = $(".skilldesc");
});
function showContent(id) {
	$(".row.double").each(function(i) {
		/* fill in the rest of the page */
		if (i == id) {
			$(this).removeClass("hidden");
			$(this).find('*').addClass("active");
		}
		else {
			$(this).addClass("hidden");
			$(this).find('*').removeClass("active");
		}
	});
}
function displayModal(modal, i) {
	modal.classList.remove("hidden");
	modal.classList.add("active");
	/* Change text inside modal */
	skillvideo.attr("src", SRC_URLS[i] + SRC_SUFFIX);
	skilldesc.find("h2").text(SKILL_NAMES[i]);
	skilldesc.find("p").text(SKILL_DESCS[i]);
}
function hideModal(modal) {
	modal.classList.remove("active");
	setTimeout(function() {
		modal.classList.add("hidden");
	}, 400);
}