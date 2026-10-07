// Fill in the Stripe Price IDs (they start with "price_"). These are not secret.
// Create one Product and Price per item in your Stripe Dashboard, then paste the IDs here.
// Anything left empty cannot be bought. The server only accepts items listed here,
// so visitors cannot change prices from their browser.
module.exports = {
  // Party boxes, one per theme
  boxes: {
    "21st-birthday": "price_1UNiqkPcDLOMUTAQDqXJH82o",
    "friendsgiving": "price_1UNlIkPcDLOMUTAQBZ5gv7Sn",
    "christmas": "price_1UNlNDPcDLOMUTAQ2WS4beB0",
    "halloween": "price_1UNx3zPcDLOMUTAQ3I6O9MPm",
    "get-wild": "price_1UNx4xPcDLOMUTAQfTa7hp9e",
    "cowgirl-western": "price_1UNx64PcDLOMUTAQ5tL2q3rF",
    "coquette": "price_1UNx87PcDLOMUTAQM3CBLMd6",
    "slumber-party": "price_1UNx8nPcDLOMUTAQashICMhz",
    "paint-and-sip": "price_1UNx5IPcDLOMUTAQExZ3nhCk",
    "beach-luau": "price_1UNx9LPcDLOMUTAQL96HUkFC",
    "game-day": "price_1UNxByPcDLOMUTAQPLoKljD1",
    "graduation": "price_1UNxD9PcDLOMUTAQIelHKSYJ"
  },
  // Add-ons shared by every theme
  addons: {
    birthday: "price_1UNxEQPcDLOMUTAQmptgAFes", // Birthday add-on (sash, crown, small gift)
    guests4: "price_1UNxomPcDLOMUTAQOeJTndyg", // Expand the fun, +4 guests ($25)
    guests8: "price_1UNxphPcDLOMUTAQiRbgDDlY", // Expand the fun, +8 guests ($40)
    guests4Activity: "price_1UNxvEPcDLOMUTAQubu2GHww", // +4 guests for Paint and Sip and Slumber Party ($35)
    guests8Activity: "price_1UNxxjPcDLOMUTAQh7c5tfN6", // +8 guests for Paint and Sip and Slumber Party ($60)
    favors: "price_1UNxIKPcDLOMUTAQgqDkCMdk",   // Guest favors set
    drinks: "price_1UNxF7PcDLOMUTAQy8Zvsg4X",   // Mocktail and cocktail kit
    banner: "price_1UNxLKPcDLOMUTAQX3JO4EUN",   // Custom banner
    cleanup: "price_1UNxLyPcDLOMUTAQWr6dLeOH"   // Cleanup kit
  },
  // The recommended add-on that is different for each theme (sash and crown set, etc.)
  extras: {
    "21st-birthday": "",
    "friendsgiving": "",
    "christmas": "",
    "halloween": "price_1UNx3zPcDLOMUTAQ3I6O9MPm",
    "get-wild": "price_1UNx4xPcDLOMUTAQfTa7hp9e",
    "cowgirl-western": "price_1UNx64PcDLOMUTAQ5tL2q3rF",
    "coquette": "",
    "slumber-party": "",
    "paint-and-sip": "price_1UNx5IPcDLOMUTAQExZ3nhCk",
    "beach-luau": "",
    "game-day": "",
    "graduation": ""
  }
};
