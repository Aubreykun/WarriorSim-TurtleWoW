var runes = {
   "chest": [
      {
         id: 402877,
         name: 'Flagellation',
         description: "Gain a 25% bonus to physical damage done for 12 sec after activating Bloodrage or Berserker Rage.",
         iconname: 'Flagellation',
         flagellation: true,
     },
     {
         id: 412507,
         name: 'Blood Frenzy',
         description: "Each time you deal Bleed damage, you gain 3 rage.",
         iconname: 'Blood-Frenzy',
         bleedrage: 3,
     },
     {
         id: 402911,
         name: 'Raging Blow',
         description: "A ferocious strike that deals 100% weapon damage, but can only be used while Enrage, Berserker Rage, or Bloodrage is active.",
         iconname: 'Raging-Blow',
         enable: 402911
     },
     {
         id: 425421,
         name: 'Warbringer',
         description: "Your Charge, Intercept, and Intervene abilities are now usable while in combat and in any stance, and will all remove movement impairing effects when activated.",
         iconname: 'Warbringer',
     },
   ],
   "legs": [
      {
         id: 403219,
         name: 'Furious Thunder',
         description: "Thunder Clap now increases the time between attacks by an additional 6% and can be used in any stance.",
         iconname: 'Furious-Thunder',
     },
     {
         id: 425418,
         name: 'Consumed by Rage',
         description: "Enrages you and grants you a 25% melee damage bonus for 12 sec or up to a maximum of 12 swings after you exceed 80 Rage.",
         iconname: 'Consumed-by-Rage',
         enable: 425418,
     },
     {
         id: 431046,
         name: 'Frenzied Assault',
         description: "While wielding 2-handed weapons, your attack speed is increased by 20%.",
         iconname: 'Frenzied-Assault',
         haste2h: 20,
     },
   ],
   "hands": [
      {
         id: 402927,
         name: 'Victory Rush',
         description: "Instantly attack the target causing Attack power * 45 / 100 damage and healing you for 10% of your maximum health. Only usable within 20 sec after you kill an enemy that yields experience or honor.",
         iconname: 'Victory-Rush',
         enable: 402927,
     },
     {
         id: 403218,
         name: 'Endless Rage',
         description: "You generate 25% more Rage from all damage you deal.<br />[ASSUMED NO EFFECT ON REFUNDS]",
         iconname: 'Endless-Rage',
         ragemod: 1.25,
     },
     {
         id: 403195,
         name: 'Devastate',
         description: "While you are in Defensive Stance and have a shield equipped, Sunder Armor also deals 100% weapon damage, increased by 10% per application of Sunder Armor already on the target.",
         iconname: 'Devastate',
         devastate: true,
     },
     {
         id: 430472,
         name: 'Single-Minded Fury',
         description: "While dual-wielding, your Physical damage and movement speed are increased by 10%.",
         iconname: 'Single-Minded-Fury',
         dmgdw: 10
     },
     {
         id: 429765,
         name: 'Quick Strike',
         description: "A reckless instant melee attack with your two-handed weapon dealing (Attack power * 15 / 100) to (Attack power * 25 / 100) physical damage. This ability benefits from and triggers all effects associated with Heroic Strike.<BR/>[DONT REALLY KNOW HOW THIS WORKS DOES IT INTERACT WITH HS QUEUE?]",
         iconname: 'inv_axe_03',
         twohandonly: true,
         enable: 429765,
     },
   ],
   "waist": [
        {
            id: 413380,
            name: 'Blood Surge',
            description: "",
            iconname: 'ability_warrior_bloodsurge',
            bloodsurge: true,
        },
        {
            id: 29787,
            name: 'Focused Rage',
            description: "",
            iconname: 'ability_druid_enrage',
            focusedrage: true,
        },
        {
            id: 402922,
            name: 'Precise Timing',
            description: "",
            iconname: 'inv_misc_pocketwatch_02',
            precisetiming: true,
        },
    ],
    "feet": [
        {
            id: 426490,
            name: 'Rallying Cry',
            description: "",
            iconname: 'ability_warrior_rallyingcry',
        },
    ],
};
