var NIGHT_MODE = 0;
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
				   "Wither Barrage", "Wither Seeker", "Wither Rebirth", "Wither Storm",
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
				   "Absorbs up to 3 magical attacks. If all 3 blocks are used, your next melee attack applies a random powerful hostile effect (either Hunger, Poison, Blind, or Slow).", 
				   "Absorbs up to 3 magical attacks. If all 3 blocks are used, gain a large burst of Speed.", 
				   "Absorbs up to 3 magical attacks. If all 3 blocks are used, your next melee attack applies [Silence], placing all of your enemy's skills on a 20 second cooldown.",
				   
				   "Shoot a fireball that deals explosive damage and sets enemies on fire.", 
				   "Unleashes a short-range flame attack that Burns enemies.", 
				   "Shoot a tiny ray of fire that deals explosive damage at a fixed endpoint.", 
				   "Send forth a salvo of explosive missles distributed among nearby enemies.",
				   
				   "Apply a potion that heals some health and cures Poison.", 
				   "Throw several potions that impair foes' vision.", 
				   "Apply a potion that grants brief Fire Resistance and Speed.", 
				   "Throw several potions that Poison enemies around you.",
				   
				   "Leap into the air and create a trail of fire that Burns enemies.", 
				   "Leap into the air and Burn enemies around you when you land.", 
				   "Leap into the air and drop several explosive bombs onto enemies below.", 
				   "Channel briefly, then create a huge explosion that launches you vertically into the air.",
				   
				   "Throw a whip that pulls enemies towards you.", 
				   "Throw a whip that Burns enemies.", 
				   "Throw a line of spikes on to the ground. Enemies that walk over spikes are briefly Slowed.", 
				   "Throw a whip that Poisons enemies.",
				   
				   "Throw a bomb that explodes into a cloud of Blinding powder.", 
				   "Shoot several strands of string that apply Slowness.", 
				   "Shoot a flurry of arrows.", 
				   "Throw a bomb that flings enemies away from the explosion.",
				   
				   "Dash forward in a straight line and slice through nearby enemies.", 
				   "Hitting an enemy with Blade Rush grants Stealth for 2 seconds.", 
				   "Hitting an enemy with Blade Rush throws them into the air.", 
				   "Hitting an enemy with Blade Rush also damages up to 5 nearby enemies.",
				   
				   "Gain Stealth for 4 seconds. Attacks reveal you from Stealth and apply Poison.", 
				   "The next incoming attack grants you Stealth for 4 seconds and applies Blind to nearby enemies.", 
				   "The next incoming attack grants you Stealth for 4 seconds and applies Confusion to nearby enemies.", 
				   "Stealth for 2 seconds. Can be recast twice before going on cooldown.",
				   
				   "Teleports behind the target your crosshair is pointed at.", 
				   "Marks your current position. Recasting Umbra Mark will teleport you to the marked position.", 
				   "Binds to a target for 8 seconds. If the target moves farther than 5 squares away, teleport to them.",
				   "For 3 seconds, you are unable to attack, but gain Speed and dodge all enemy melee attacks.",
				   
				   "Slows all enemies around you.", 
				   "Burns all enemies around you.", 
				   "Weakens all enemies around you.", 
				   "Scrambles the positions of all enemies around you.",
				   
				   "Summons an aura that hurts melee attacks and reduces their damage.", 
				   "Summons an aura that transfers damage to your hunger bar.", 
				   "Summons an aura that stores 50% of all damage taken. Upon storing 5 hearts of damage, throws back all enemies around you.", 
				   "Summons an aura that reflects or blocks most incoming projectiles.",

				   "Charges a shockwave that damages and slows enemies in a line near the ground.", 
				   "Charges a shockwave that damages and confuses enemies in a line near the ground.",
				   "Charges a shockwave that damages and confuses enemies in a line near the ground.",
				   "Charges a shockwave that damages and knocks up enemies in a line near the ground.",
				   
				   "Places a totem that heals nearby players. Totems last for 10 seconds.", 
				   "Places a totem that grants Speed and Invisibility to nearby players.", 
				   "Places a totem that regenerates hunger of nearby players.", 
				   "Places a totem that grants Strength to nearby players.",
				   
				   "Throws a bomb that Poisons and Slows nearby enemies upon exploding.", 
				   "Throws a bomb that leaves behind a cloud of Poisonous gas.", 
				   "Throws a bomb that splits into three more explosive TNT blocks.", 
				   "Throws a bomb that creates a zone of darkness. The zone Blinds enemies and grants you Speed.",
				   
				   "Shoots 3 explosive Wither Skulls in succession. Skulls have a chance to apply Wither to an enemy.", 
				   "Shoots a Wither Skull that locks on to the nearest target.", 
				   "Summons three Wither Skulls that orbit around your cast location. After 10 seconds, if the Skulls are still alive, all enemies in the zone are Withered and you gain Regeneration.", 
				   "Rains down 2 Wither Skulls from above for each nearby enemy, up to a maximum of 10.",
				   
				   "Slows the first enemy your crosshair is pointing at.", 
				   "Fires a burst of darkness that inflicts Blind and Wither to enemies caught in it.", 
				   "Fires a burst of darkness that explodes at the first target hit, inflicting Blind and Wither to all nearby enemies.", 
				   "Fires several bursts of darkness around you, causing enemies to Wither and Levitate.",
				   
				   "Switches locations with the first target in your crosshair. Maximum range of 20 blocks.", 
				   "Drops a trap at your feet. When an enemy steps near the trap, it Poisons everyone nearby.", 
				   "Drops a trap at your feet. When an enemy steps near the trap, it Slows everyone nearby, then teleports you to the trap location.",
				   "Drops a trap at your feet. When an enemy steps near the trap, it Blinds everyone nearby, then teleports you to the trap location.",
				   
				   "Gain a burst of Speed.", 
				   "Briefly Slow down, then gain a burst of Strength.", 
				   "Briefly apply Blindness, then gain a burst of Regeneration.", 
				   "For the next 6 seconds, you will revive upon death and throw back all enemies.",
				   
				   "Rain down a bolt of light on a single target.", 
				   "Damage and throw all nearby airborne objects to the ground.", 
				   "Fires a bolt of lightning that chains to nearby enemies.", 
				   "Conjure an aura of light that explodes in random directions around you.",
				   
				   "Shoot two snowball barrages that Slow down enemies.", 
				   "Shoot a line of ice that briefly freezes enemies.", 
				   "Immobilizes enemies in a sphere of water while dealing damage over time.", 
				   "Conjure a shield of ice that absorbs melee, explosive, and fire damage.",
				   
				   "Shoots two fireball barrages that Burn enemies.", 
				   "Cleanse yourself of  all negative potion effects and ignite everyone around you.", 
				   "Conjure a dome of flame that forces away those who touch it.", 
				   "Conjure a shield of fire that burns attackers and nearby projectiles."];
var BACK_COLORS = [[243, 156, 18],
					[120, 66, 18],
					[250, 215, 160],
					[174, 182, 191],
					[96, 96, 96],
					[229, 231, 233]];
var ROW_COLORS = [[204,204,204],
			  [217, 136, 128],
			  [52, 73, 94],
			  [34, 153, 84],
			  [203, 67, 53],
			  [244, 208, 63]];
$(document).ready(function () {
	$(".star").click(function() {
		if (!$(this).find("img").hasClass("out")) {
			/* Manage icon graphic */
			$(this).find("img").each(function() {
				var img = $(this);
				if (img.hasClass("active")) {
					img.addClass("out");
					img.removeClass("active");
					setTimeout(function() {
						img.removeClass("out");
						img.addClass("hidden");
					}, 900);
				}
				else {
					setTimeout(function() {
						img.removeClass("hidden");
						img.addClass("active");
					}, 900);
				}
			});
			/* Manage background, maybe change text color? still visible */
			NIGHT_MODE = 1 - NIGHT_MODE;
			if (NIGHT_MODE == 1) {
				setTimeout(function() {
					$(".line").css("background", "-webkit-gradient(linear, 0 0, 100% 0, from(rgb(139, 189, 255)), to(rgb(139, 189, 255)), color-stop(50%, white))");
				}, 500);
				$("body").removeClass("night");
				$("body").addClass("day");
			}
			else {
				setTimeout(function() {
					$(".line").css("background", "-webkit-gradient(linear, 0 0, 100% 0, from(black), to(black), color-stop(50%, white))");
				}, 500);
				$("body").removeClass("day");
				$("body").addClass("night");
			}
		}
	});
	/* click effect */
	$(".classicon > img, .skill > img").mouseup(function(){
        $(this).css("opacity", 1);
    });
    $(".classicon > img, .skill > img").mousedown(function(){
        $(this).css("opacity", 0.7);
    });
	$(".classicon > img, .skill > img").mouseleave(function(){
        $(this).css("opacity", 1);
    });
	
	/* Class icons */
	$(".classicon").each(function(index) {
		$(this).attr("myID", index+1);
		$(this).css("animation-delay", 2+index*0.1 + "s");
	});
	$(".classicon").click(function() {
		showContent($(this).attr("myID"));
	});
	
	/* Skillmenu animation */
	$(".row.double").each(function(s) {
		if (s > 0) {
			var bc = BACK_COLORS[s-1];
			var rc = ROW_COLORS[s-1];
			$(this).find(".skillbox").each(function(i) {
				$(this).css("background-color", 'rgba(' + bc[0] + ',' + bc[1] + ',' + bc[2] + ', 0.8)');
				$(this).find(".row").each(function(j) {
					$(this).css("background-color", 'rgba(' + rc[0] + ',' + rc[1] + ',' + rc[2] + ', 0.5)');
					$(this).css("animation-delay", 0.1*j + "s");
				});
			});
		}
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