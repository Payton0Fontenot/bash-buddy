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
    "halloween": "",
    "get-wild": "",
    "cowgirl-western": "",
    "coquette": "",
    "slumber-party": "",
    "paint-and-sip": "",
    "beach-luau": "",
    "game-day": "",
    "graduation": ""
  },
  // Add-ons shared by every theme
  addons: {
    birthday: "", // Birthday add-on (sash, crown, small gift)
    favors: "",   // Guest favors set
    drinks: "",   // Mocktail and cocktail kit
    banner: "",   // Custom banner
    cleanup: ""   // Cleanup kit
  },
  // The recommended add-on that is different for each theme (sash and crown set, etc.)
  extras: {
    "21st-birthday": "",
    "friendsgiving": "",
    "christmas": "",
    "halloween": "",
    "get-wild": "",
    "cowgirl-western": "",
    "coquette": "",
    "slumber-party": "",
    "paint-and-sip": "",
    "beach-luau": "",
    "game-day": "",
    "graduation": ""
  }
};
