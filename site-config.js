// Fill these in. Empty values stay hidden.
window.BBC = {
  instagram: "",   // full link, for example https://instagram.com/yourhandle
  reels: ["", "", ""],  // links to three Instagram reels or posts for "See it in action"
  tiktok: "",      // full link
  email: "bashbuddyco@gmail.com",
  formEndpoint: "", // form service URL (Formspree or similar) for the signup form
  // Birthday Bash reservations save to this Google Form (and its linked Sheet)
  reserveForm: {
    action: "https://docs.google.com/forms/d/e/1FAIpQLScnzRKnKn18pBZR7iqBlLM_JBMwMHbS8QI_Dt7FDnYmqsZ3og/formResponse",
    fields: {
      name: "entry.1122122589",        // First name
      email: "entry.893303035",        // Email
      party_date: "entry.1631771281",  // Party date
      guests: "entry.753292370",       // Guest count
      price_shown: "entry.1271090736"  // Price shown
    }
  }
};
