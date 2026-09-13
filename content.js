/* ============================================================================
   JOM CUTI — content.js
   Single source of truth for all website content. Edit this file to change
   destinations, activities, recommendations, tips or contact details —
   nothing else needs to change.
   ========================================================================== */

const CONTENT = {

  /* ---------------------------------------------------------------------
     SITE INFO
  --------------------------------------------------------------------- */
  siteInfo: {
    name: "Jom Cuti",
    tagline: "Your Malaysia, Your Way",
    description:
      "Jom Cuti helps you discover Malaysia's best destinations, plan the perfect itinerary, and travel like a local — from the streets of Penang to the reefs of Perhentian.",
    heroHeadline: "Jom, Let's Cuti! 🌴",
    heroSubheadline:
      "Discover Malaysia's beaches, rainforests, heritage cities and street food — then build an itinerary that's entirely yours.",
  },

  /* ---------------------------------------------------------------------
     REGIONS & STATES
  --------------------------------------------------------------------- */
  regions: [
    { id: "north", name: "Northern Peninsula" },
    { id: "central", name: "Central Peninsula" },
    { id: "south", name: "Southern Peninsula" },
    { id: "east-coast", name: "East Coast Peninsula" },
    { id: "borneo", name: "East Malaysia (Borneo)" },
  ],

  states: [
    { name: "Kuala Lumpur", region: "central" },
    { name: "Selangor", region: "central" },
    { name: "Pahang", region: "central" },
    { name: "Penang", region: "north" },
    { name: "Kedah", region: "north" },
    { name: "Perak", region: "north" },
    { name: "Melaka", region: "south" },
    { name: "Johor", region: "south" },
    { name: "Terengganu", region: "east-coast" },
    { name: "Kelantan", region: "east-coast" },
    { name: "Sabah", region: "borneo" },
    { name: "Sarawak", region: "borneo" },
  ],

  /* ---------------------------------------------------------------------
     ACTIVITY / THINGS-TO-DO CATEGORIES
     Each destination's activityPool entries reference these ids.
  --------------------------------------------------------------------- */
  activityCategories: [
    {
      id: "food",
      label: "Food",
      icon: "food",
      color: "orange",
      description:
        "Hawker stalls, night markets and generations-old recipes — Malaysia is one of the world's great eating destinations.",
    },
    {
      id: "nature",
      label: "Nature",
      icon: "nature",
      color: "green",
      description:
        "Ancient rainforests, misty highlands and rare wildlife, all within a short domestic flight of each other.",
    },
    {
      id: "beaches",
      label: "Beaches",
      icon: "beach",
      color: "blue",
      description:
        "Powder-white sand, turquoise reefs and laid-back island life on both coasts of the peninsula and beyond.",
    },
    {
      id: "culture",
      label: "Culture",
      icon: "culture",
      color: "yellow",
      description:
        "Colonial architecture, ancient temples and living heritage from three great civilisations meeting in one country.",
    },
    {
      id: "adventure",
      label: "Adventure",
      icon: "adventure",
      color: "orange",
      description:
        "Jungle treks, cave systems, diving and highland trails for travellers who like their holidays with a pulse.",
    },
    {
      id: "family",
      label: "Family",
      icon: "family",
      color: "green",
      description:
        "Theme parks, wildlife encounters and easy-going attractions that keep every age entertained.",
    },
  ],

  /* ---------------------------------------------------------------------
     DESTINATIONS
     activityPool entries power BOTH the Things To Do page and the
     Itinerary Planner — nothing is duplicated.
  --------------------------------------------------------------------- */
  destinations: [
    {
      id: "kuala-lumpur",
      name: "Kuala Lumpur",
      state: "Kuala Lumpur",
      region: "central",
      tags: ["culture", "food", "family", "adventure"],
      tagline: "Skyscrapers, street food and soul in Malaysia's buzzing capital",
      description:
        "KL packs colonial shophouses, gleaming towers, world-class hawker food and a thumping nightlife scene into one endlessly walkable city. It's the natural start (or end) to almost any Malaysian trip.",
      highlights: ["Petronas Twin Towers", "Batu Caves", "Jalan Alor food street", "Bukit Bintang nightlife"],
      suggestedDays: { min: 2, max: 4 },
      budgetLevels: ["budget", "midrange", "luxury"],
      bestTime: "Year-round; driest Jun–Aug",
      heroTheme: "city",
      rating: 4.8,
      featured: true,
      activityPool: [
        { title: "Petronas Twin Towers Skybridge & Observation Deck", category: "culture", timeOfDay: "morning", duration: "2h", description: "Ride to the 86th floor for skyline views, then cross the double-decker skybridge." },
        { title: "Batu Caves temple climb", category: "culture", timeOfDay: "morning", duration: "3h", description: "Climb 272 rainbow steps to a limestone cave temple guarded by macaques." },
        { title: "Jalan Alor street food crawl", category: "food", timeOfDay: "evening", duration: "2h", description: "Work through satay, grilled stingray and claypot rice at KL's most famous food street." },
        { title: "KL Forest Eco Park canopy walk", category: "nature", timeOfDay: "afternoon", duration: "2h", description: "A pocket of untouched rainforest with a canopy walkway right in the city centre." },
        { title: "Central Market & Kasturi Walk shopping", category: "culture", timeOfDay: "afternoon", duration: "2h", description: "Browse batik, art and souvenirs in a restored Art Deco market hall." },
        { title: "Sky Bar rooftop sunset", category: "family", timeOfDay: "evening", duration: "2h", description: "Watch the sun set behind the Petronas Towers from a rooftop pool bar." },
        { title: "Thean Hou Temple visit", category: "culture", timeOfDay: "morning", duration: "1h", description: "One of Southeast Asia's largest Chinese temples, with sweeping city views." },
        { title: "Sunway Lagoon theme park day", category: "family", timeOfDay: "afternoon", duration: "5h", description: "Water park, amusement rides and a wildlife park in one sprawling complex." },
      ],
    },
    {
      id: "george-town",
      name: "George Town, Penang",
      state: "Penang",
      region: "north",
      tags: ["food", "culture"],
      tagline: "Malaysia's food capital, wrapped in UNESCO heritage streets",
      description:
        "A UNESCO World Heritage old town of clan jetties, street art and some of the best hawker food on the planet — Penang rewards slow wandering and an empty stomach.",
      highlights: ["Street art trail", "Clan Jetties", "Penang Hill", "Char kway teow at Lorong Selamat"],
      suggestedDays: { min: 2, max: 3 },
      budgetLevels: ["budget", "midrange"],
      bestTime: "Dec–Mar for cooler, drier weather",
      heroTheme: "heritage",
      rating: 4.9,
      featured: true,
      activityPool: [
        { title: "George Town street art hunt", category: "culture", timeOfDay: "morning", duration: "3h", description: "Track down Ernest Zacharevic's famous murals through the old town's back lanes." },
        { title: "Clan Jetties waterfront walk", category: "culture", timeOfDay: "afternoon", duration: "1h", description: "Wooden stilt houses built by early Chinese clans, still lived in today." },
        { title: "Penang Hill funicular & sunset", category: "nature", timeOfDay: "evening", duration: "3h", description: "Escape the heat with a ride up to cooler air and views over the strait." },
        { title: "Hawker dinner: char kway teow & assam laksa", category: "food", timeOfDay: "evening", duration: "2h", description: "Chase down Penang's two most legendary noodle dishes at rival hawker stalls." },
        { title: "Kek Lok Si Temple", category: "culture", timeOfDay: "morning", duration: "2h", description: "Malaysia's largest Buddhist temple complex, best visited early before the crowds." },
        { title: "Tropical Spice Garden walk", category: "nature", timeOfDay: "morning", duration: "2h", description: "A landscaped rainforest garden with over 500 species of tropical plants." },
      ],
    },
    {
      id: "langkawi",
      name: "Langkawi",
      state: "Kedah",
      region: "north",
      tags: ["beaches", "nature", "family"],
      tagline: "Duty-free islands with beaches, cable cars and mangrove tours",
      description:
        "An archipelago of 99 islands known for laid-back beaches, a dramatic cable car over the rainforest canopy, and mangrove tours that get you eye-to-eye with eagles.",
      highlights: ["SkyCab cable car", "Pantai Cenang sunset", "Mangrove river safari", "Island-hopping boat tour"],
      suggestedDays: { min: 3, max: 5 },
      budgetLevels: ["budget", "midrange", "luxury"],
      bestTime: "Nov–Mar (dry season)",
      heroTheme: "beach",
      rating: 4.7,
      featured: true,
      activityPool: [
        { title: "Langkawi SkyCab & Sky Bridge", category: "adventure", timeOfDay: "morning", duration: "2h", description: "A steep cable car to the top of Gunung Mat Cincang, then a curved sky bridge over the jungle." },
        { title: "Pantai Cenang sunset & beach bars", category: "beaches", timeOfDay: "evening", duration: "3h", description: "Langkawi's liveliest beach strip, best enjoyed with your feet in the sand at golden hour." },
        { title: "Kilim Geoforest mangrove safari", category: "nature", timeOfDay: "morning", duration: "3h", description: "A boat tour through limestone karsts and mangroves, spotting eagles and macaques." },
        { title: "Island-hopping: Pulau Beras Basah & Pulau Singa Besar", category: "beaches", timeOfDay: "afternoon", duration: "4h", description: "Speedboat out to talcum-white sandbars and snorkelling spots." },
        { title: "Underwater World aquarium", category: "family", timeOfDay: "afternoon", duration: "2h", description: "One of Asia's largest aquariums, a good rainy-day option with kids." },
        { title: "Telaga Tujuh seven wells waterfall", category: "nature", timeOfDay: "morning", duration: "2h", description: "Natural rock pools stepped down a hillside, a short hike from the cable car base." },
      ],
    },
    {
      id: "melaka",
      name: "Melaka City",
      state: "Melaka",
      region: "south",
      tags: ["culture", "food"],
      tagline: "500 years of trade history in one walkable riverside city",
      description:
        "A former Portuguese, Dutch and British trading port, Melaka's old town is a dense, walkable mix of temples, mosques, colonial forts and Peranakan shophouses turned cafés.",
      highlights: ["Jonker Street night market", "A Famosa fort ruins", "Melaka River cruise", "Baba Nyonya heritage houses"],
      suggestedDays: { min: 1, max: 2 },
      budgetLevels: ["budget", "midrange"],
      bestTime: "Year-round; weekends bring Jonker Street market to life",
      heroTheme: "heritage",
      rating: 4.6,
      featured: false,
      activityPool: [
        { title: "Jonker Street night market", category: "food", timeOfDay: "evening", duration: "3h", description: "Weekend street market with Nyonya snacks, chicken rice balls and live buskers." },
        { title: "Melaka River night cruise", category: "culture", timeOfDay: "evening", duration: "1h", description: "A lantern-lit boat ride past murals and riverside cafés." },
        { title: "A Famosa & St Paul's Hill", category: "culture", timeOfDay: "morning", duration: "2h", description: "The last gate of a 16th-century Portuguese fortress, atop a hill with harbour views." },
        { title: "Baba Nyonya Heritage Museum", category: "culture", timeOfDay: "afternoon", duration: "1h", description: "A preserved 19th-century Peranakan townhouse packed with period furniture." },
        { title: "Nyonya laksa lunch on Jonker Street", category: "food", timeOfDay: "afternoon", duration: "1h", description: "A rich, coconut-based noodle soup unique to Melaka's Peranakan community." },
      ],
    },
    {
      id: "cameron-highlands",
      name: "Cameron Highlands",
      state: "Pahang",
      region: "central",
      tags: ["nature", "family"],
      tagline: "Rolling tea plantations and cool mountain air",
      description:
        "Malaysia's largest hill station, blanketed in tea estates, strawberry farms and mossy forest — a refreshing change of pace and temperature from the lowlands.",
      highlights: ["BOH Tea Plantation", "Mossy Forest boardwalk", "Strawberry farms", "Cameron Valley viewpoints"],
      suggestedDays: { min: 2, max: 3 },
      budgetLevels: ["budget", "midrange"],
      bestTime: "Mar–Sep, cool year-round (bring a jacket)",
      heroTheme: "highlands",
      rating: 4.5,
      featured: true,
      activityPool: [
        { title: "BOH Tea Plantation tour & tea tasting", category: "nature", timeOfDay: "morning", duration: "2h", description: "Walk between rows of tea bushes and sample freshly brewed BOH tea overlooking the valley." },
        { title: "Mossy Forest boardwalk", category: "nature", timeOfDay: "morning", duration: "2h", description: "A cool, moss-draped elfin forest near the highest accessible point in the highlands." },
        { title: "Strawberry farm picking", category: "family", timeOfDay: "afternoon", duration: "1h", description: "Pick your own strawberries and try strawberry ice cream at a hillside farm." },
        { title: "Cameron Valley lookout & vegetable farms", category: "nature", timeOfDay: "afternoon", duration: "2h", description: "Terraced vegetable farms and viewpoints over the valley's patchwork of crops." },
        { title: "Big Red Strawberry Farm night market", category: "food", timeOfDay: "evening", duration: "1h", description: "Local produce, steamboat dinners and warm drinks in the cool evening air." },
      ],
    },
    {
      id: "perhentian",
      name: "Perhentian Islands",
      state: "Terengganu",
      region: "east-coast",
      tags: ["beaches", "adventure"],
      tagline: "Clear-water diving and snorkelling off the east coast",
      description:
        "Two small islands ringed by coral reef and turtle nesting beaches — no cars, patchy wifi, and some of the clearest water in the country. Best visited outside monsoon season.",
      highlights: ["Turtle snorkelling at Turtle Point", "Long Beach sunsets", "PADI dive courses", "Jungle-trail island crossing"],
      suggestedDays: { min: 2, max: 4 },
      budgetLevels: ["budget", "midrange"],
      bestTime: "Mar–Oct only (closed / rough seas Nov–Feb)",
      heroTheme: "beach",
      rating: 4.7,
      featured: true,
      activityPool: [
        { title: "Snorkelling with turtles at Turtle Point", category: "beaches", timeOfDay: "morning", duration: "2h", description: "A short boat ride to a reef where green turtles feed close to the surface." },
        { title: "PADI Open Water dive course", category: "adventure", timeOfDay: "morning", duration: "6h", description: "Get certified over three days of dives among reef sharks and clownfish." },
        { title: "Long Beach sunset & beach bar", category: "beaches", timeOfDay: "evening", duration: "2h", description: "Perhentian Kecil's social hub, best enjoyed with a fresh coconut in hand." },
        { title: "Jungle trail crossing to Coral Bay", category: "adventure", timeOfDay: "afternoon", duration: "2h", description: "A sweaty but scenic hike through island jungle between two beaches." },
        { title: "Island-hopping snorkel boat trip", category: "beaches", timeOfDay: "afternoon", duration: "3h", description: "Stop at several reef sites for snorkelling with reef sharks and rays." },
      ],
    },
    {
      id: "taman-negara",
      name: "Taman Negara",
      state: "Pahang",
      region: "east-coast",
      tags: ["nature", "adventure"],
      tagline: "130-million-year-old rainforest and canopy walkways",
      description:
        "One of the world's oldest rainforests, reached by a scenic river boat ride, with jungle treks, a swaying canopy walkway and night safaris for spotting wildlife.",
      highlights: ["Canopy walkway", "Night jungle safari", "Rapids boat ride", "Gua Telinga cave trek"],
      suggestedDays: { min: 2, max: 3 },
      budgetLevels: ["budget", "midrange"],
      bestTime: "Feb–Sep (avoid the Nov–Jan wet season)",
      heroTheme: "rainforest",
      rating: 4.6,
      featured: false,
      activityPool: [
        { title: "Canopy walkway trek", category: "adventure", timeOfDay: "morning", duration: "3h", description: "One of the world's longest canopy walkways, strung 40m above the forest floor." },
        { title: "Night jungle safari", category: "nature", timeOfDay: "evening", duration: "2h", description: "A guided night walk spotting nocturnal wildlife with torches." },
        { title: "Gua Telinga cave trek", category: "adventure", timeOfDay: "morning", duration: "3h", description: "Crawl through a limestone cave home to thousands of roosting bats." },
        { title: "Kuala Tahan river rapids boat ride", category: "nature", timeOfDay: "afternoon", duration: "2h", description: "A bumpy longboat ride through shallow rapids upriver from the park entrance." },
      ],
    },
    {
      id: "kota-kinabalu",
      name: "Kota Kinabalu",
      state: "Sabah",
      region: "borneo",
      tags: ["nature", "beaches", "adventure"],
      tagline: "Gateway to Mount Kinabalu, island beaches and orangutans",
      description:
        "Sabah's laid-back capital sits beneath Southeast Asia's tallest peak and a short boat ride from postcard islands — a base for mountains, reefs and rainforest wildlife alike.",
      highlights: ["Mount Kinabalu views", "Tunku Abdul Rahman Marine Park", "Signal Hill sunset", "Mari Mari Cultural Village"],
      suggestedDays: { min: 3, max: 5 },
      budgetLevels: ["midrange", "luxury"],
      bestTime: "Mar–Aug (drier, calmer seas)",
      heroTheme: "mountain",
      rating: 4.7,
      featured: true,
      activityPool: [
        { title: "Tunku Abdul Rahman Marine Park island hop", category: "beaches", timeOfDay: "morning", duration: "5h", description: "Ferry out to Manukan or Sapi Island for snorkelling and white-sand beaches." },
        { title: "Kinabalu Park half-day trip", category: "nature", timeOfDay: "morning", duration: "6h", description: "See Mount Kinabalu up close and wander the park's botanical trails without summiting." },
        { title: "Mari Mari Cultural Village", category: "culture", timeOfDay: "afternoon", duration: "3h", description: "A recreated village showcasing Sabah's five main indigenous tribes." },
        { title: "Signal Hill Observatory sunset", category: "family", timeOfDay: "evening", duration: "1h", description: "A short walk up for a free panoramic sunset view over the city and harbour." },
        { title: "Gaya Street Sunday market", category: "food", timeOfDay: "morning", duration: "2h", description: "A sprawling weekend market for local breakfast, produce and handicrafts." },
        { title: "Sepilok Orangutan Rehabilitation Centre day trip", category: "nature", timeOfDay: "morning", duration: "6h", description: "Watch semi-wild orangutans at feeding time (roughly 1.5hr from the city)." },
      ],
    },
    {
      id: "kuching",
      name: "Kuching",
      state: "Sarawak",
      region: "borneo",
      tags: ["culture", "nature", "food"],
      tagline: "Cat statues, riverside charm and orangutans in the wild",
      description:
        "Sarawak's charming, low-rise capital pairs a walkable colonial riverfront with easy access to rainforest national parks — a quieter, greener counterpoint to the peninsula.",
      highlights: ["Kuching Waterfront", "Semenggoh Wildlife Centre", "Bako National Park", "Sarawak laksa"],
      suggestedDays: { min: 2, max: 4 },
      budgetLevels: ["budget", "midrange"],
      bestTime: "Jun–Sep (drier months)",
      heroTheme: "rainforest",
      rating: 4.6,
      featured: false,
      activityPool: [
        { title: "Kuching Waterfront evening stroll", category: "culture", timeOfDay: "evening", duration: "2h", description: "A landscaped riverside promenade with food stalls and views of the Astana palace." },
        { title: "Semenggoh Wildlife Centre feeding time", category: "nature", timeOfDay: "morning", duration: "3h", description: "See semi-wild orangutans up close during the morning feeding session." },
        { title: "Bako National Park day trip", category: "adventure", timeOfDay: "morning", duration: "6h", description: "Coastal jungle trails, sea stacks and proboscis monkeys, reached by river boat." },
        { title: "Sarawak laksa breakfast", category: "food", timeOfDay: "morning", duration: "1h", description: "A spicier, tangier cousin of Malaysia's other laksas — try it at a local kopitiam." },
        { title: "Sarawak Cultural Village", category: "culture", timeOfDay: "afternoon", duration: "3h", description: "A living museum of Sarawak's indigenous longhouses and traditional dances." },
      ],
    },
    {
      id: "ipoh",
      name: "Ipoh",
      state: "Perak",
      region: "north",
      tags: ["food", "culture"],
      tagline: "Old tin-mining town famous for coffee and cave temples",
      description:
        "A former tin-mining boomtown with beautifully restored old town shophouses, cavernous limestone cave temples, and a coffee culture locals take very seriously.",
      highlights: ["Ipoh white coffee", "Old Town mural walk", "Perak Cave Temple", "Concubine Lane"],
      suggestedDays: { min: 1, max: 2 },
      budgetLevels: ["budget", "midrange"],
      bestTime: "Year-round",
      heroTheme: "heritage",
      rating: 4.5,
      featured: false,
      activityPool: [
        { title: "Ipoh white coffee at a heritage kopitiam", category: "food", timeOfDay: "morning", duration: "1h", description: "Try the smooth, butter-roasted coffee Ipoh is famous for at a decades-old café." },
        { title: "Old Town mural & heritage walk", category: "culture", timeOfDay: "morning", duration: "2h", description: "Street art and colonial shophouses packed into a compact, walkable old quarter." },
        { title: "Perak Cave Temple (Sam Poh Tong)", category: "culture", timeOfDay: "afternoon", duration: "2h", description: "A Buddhist temple built into a limestone cave with a small turtle pond and gardens." },
        { title: "Concubine Lane snacks", category: "food", timeOfDay: "afternoon", duration: "1h", description: "A narrow heritage lane of snack stalls, once home to tin tycoons' mistresses." },
      ],
    },
    {
      id: "genting-highlands",
      name: "Genting Highlands",
      state: "Pahang",
      region: "central",
      tags: ["family", "adventure"],
      tagline: "Theme parks and casino lights above the clouds",
      description:
        "A hilltop resort city an hour from KL, with Southeast Asia's largest indoor theme park, a cable car ride through the clouds, and cooler mountain-top air.",
      highlights: ["Genting SkyWorlds theme park", "Awana SkyWay cable car", "First World Plaza", "Chin Swee Caves Temple"],
      suggestedDays: { min: 1, max: 2 },
      budgetLevels: ["midrange", "luxury"],
      bestTime: "Year-round; cool at altitude, pack a light jacket",
      heroTheme: "highlands",
      rating: 4.3,
      featured: false,
      activityPool: [
        { title: "Genting SkyWorlds theme park", category: "family", timeOfDay: "morning", duration: "6h", description: "Rides and shows themed around Hollywood franchises, indoors and out." },
        { title: "Awana SkyWay cable car", category: "adventure", timeOfDay: "morning", duration: "1h", description: "One of the fastest cable cars in the world, rising through cloud forest to the summit." },
        { title: "Chin Swee Caves Temple", category: "culture", timeOfDay: "afternoon", duration: "1h", description: "A colourful hillside temple reachable by a short cable car detour." },
        { title: "First World Plaza arcade & shopping", category: "family", timeOfDay: "evening", duration: "2h", description: "Indoor entertainment, shopping and dining for cooler evening hours." },
      ],
    },
    {
      id: "redang",
      name: "Redang Island",
      state: "Terengganu",
      region: "east-coast",
      tags: ["beaches"],
      tagline: "Marine park beaches with some of Malaysia's clearest water",
      description:
        "A protected marine park island with talcum-fine beaches and excellent snorkelling straight off the sand — quieter and more resort-focused than the Perhentians.",
      highlights: ["Marine park snorkelling", "Turtle sanctuary", "Long Beach", "Coral Redang house reef"],
      suggestedDays: { min: 2, max: 3 },
      budgetLevels: ["midrange", "luxury"],
      bestTime: "Mar–Oct only (closed Nov–Feb)",
      heroTheme: "beach",
      rating: 4.6,
      featured: false,
      activityPool: [
        { title: "House reef snorkelling", category: "beaches", timeOfDay: "morning", duration: "2h", description: "Wade straight off the beach onto coral reef teeming with reef fish." },
        { title: "Marine Park Centre & turtle sanctuary", category: "nature", timeOfDay: "afternoon", duration: "1h", description: "Learn about the island's turtle conservation efforts at the park centre." },
        { title: "Sunset kayaking", category: "adventure", timeOfDay: "evening", duration: "1h", description: "Paddle the calm bay as the sky turns orange behind the hills." },
        { title: "Boat snorkel trip to Pulau Lima", category: "beaches", timeOfDay: "afternoon", duration: "3h", description: "A short boat ride to a nearby islet with excellent visibility." },
      ],
    },
  ],

  /* ---------------------------------------------------------------------
     TRAVEL RECOMMENDATIONS
     duration: "weekend" | "week" | "twoweeks"
     style:    "budget"  | "midrange" | "luxury"
  --------------------------------------------------------------------- */
  recommendations: [
    {
      id: "weekend-budget-heritage",
      title: "Budget Weekend: KL & Melaka Heritage Hop",
      duration: "weekend",
      style: "budget",
      description: "Two heritage cities, a river cruise and enough street food to need a bigger suitcase — all on a backpacker budget.",
      destinationIds: ["kuala-lumpur", "melaka"],
      estimatedBudget: "RM 500–800 per person",
      highlights: ["Batu Caves", "Jalan Alor food crawl", "Jonker Street night market", "A Famosa fort"],
    },
    {
      id: "weekend-midrange-penang",
      title: "Foodie Weekend in Penang",
      duration: "weekend",
      style: "midrange",
      description: "A tight loop of hawker stalls, street art and a hill-top sunset for travellers who plan their trips around meals.",
      destinationIds: ["george-town"],
      estimatedBudget: "RM 900–1,400 per person",
      highlights: ["Assam laksa", "Street art trail", "Penang Hill sunset", "Kek Lok Si Temple"],
    },
    {
      id: "week-midrange-beach-city",
      title: "One Week: City & Island Combo",
      duration: "week",
      style: "midrange",
      description: "Three days of city energy in KL followed by four days unwinding on Langkawi's beaches — the classic first-timer's Malaysia trip.",
      destinationIds: ["kuala-lumpur", "langkawi"],
      estimatedBudget: "RM 2,500–3,800 per person",
      highlights: ["Petronas Towers", "SkyCab cable car", "Island-hopping boat tour", "Pantai Cenang sunset"],
    },
    {
      id: "week-luxury-borneo",
      title: "One Week Luxury: Borneo Wildlife & Reef",
      duration: "week",
      style: "luxury",
      description: "Orangutans, coral reefs and mountain views from Sabah's best resorts — nature travel without roughing it.",
      destinationIds: ["kota-kinabalu"],
      estimatedBudget: "RM 4,500–7,000 per person",
      highlights: ["Sepilok orangutans", "Tunku Abdul Rahman islands", "Kinabalu Park", "Signal Hill sunset"],
    },
    {
      id: "week-budget-eastcoast",
      title: "One Week Budget: East Coast Island Hopper",
      duration: "week",
      style: "budget",
      description: "Diving, snorkelling and hammock time across two of the east coast's best dive islands, done on a shoestring.",
      destinationIds: ["perhentian", "redang"],
      estimatedBudget: "RM 1,600–2,400 per person",
      highlights: ["Turtle Point snorkelling", "PADI dive course", "Long Beach sunsets", "House reef snorkelling"],
    },
    {
      id: "twoweeks-midrange-grand-tour",
      title: "Two-Week Grand Tour of Peninsular Malaysia",
      duration: "twoweeks",
      style: "midrange",
      description: "The full peninsula arc — capital, hills, heritage coast and islands — paced for travellers who want to see it all without rushing.",
      destinationIds: ["kuala-lumpur", "cameron-highlands", "george-town", "langkawi", "melaka"],
      estimatedBudget: "RM 5,000–7,500 per person",
      highlights: ["BOH Tea Plantation", "Street art in Penang", "SkyCab", "Jonker Street"],
    },
    {
      id: "twoweeks-luxury-east-malaysia",
      title: "Two-Week Luxury: East Malaysia Explorer",
      duration: "twoweeks",
      style: "luxury",
      description: "Sabah and Sarawak in depth — rainforest lodges, wildlife encounters and two very different Bornean capitals.",
      destinationIds: ["kota-kinabalu", "kuching", "taman-negara"],
      estimatedBudget: "RM 8,000–12,000 per person",
      highlights: ["Orangutan feeding sessions", "Bako National Park", "Canopy walkway", "Mari Mari Cultural Village"],
    },
    {
      id: "family-week-midrange",
      title: "Family Week: Beaches, Theme Parks & Wildlife",
      duration: "week",
      style: "midrange",
      description: "Built for travelling with kids — short transfers, splash parks, animal encounters and easy beach days.",
      destinationIds: ["genting-highlands", "kuala-lumpur", "langkawi"],
      estimatedBudget: "RM 3,000–4,500 per family unit",
      highlights: ["Genting SkyWorlds", "Sunway Lagoon", "Underwater World Langkawi", "Pantai Cenang"],
    },
  ],

  /* ---------------------------------------------------------------------
     TRAVEL TIPS
  --------------------------------------------------------------------- */
  travelTips: [
    { id: "visa", title: "Visa & Entry", icon: "info", tip: "Most Western, ASEAN and many Asian passport holders get visa-free entry for 30–90 days. Check the latest rules for your nationality before booking, as they change periodically." },
    { id: "currency", title: "Currency", icon: "wallet", tip: "The Malaysian Ringgit (RM/MYR) is used everywhere. Cities are increasingly cashless (DuitNow QR, cards), but carry small cash for hawker stalls, markets and rural areas." },
    { id: "weather", title: "Weather & Packing", icon: "sun", tip: "Hot and humid year-round (25–33°C). The East Coast and islands close or get rough seas Nov–Feb (monsoon); the West Coast is wetter Sep–Nov. Pack light fabrics, a rain jacket and a light sweater for highland towns." },
    { id: "language", title: "Language", icon: "chat", tip: "Bahasa Malaysia is the national language, but English is widely spoken in cities, hotels and with younger Malaysians. A friendly 'terima kasih' (thank you) goes a long way." },
    { id: "transport", title: "Getting Around", icon: "map", tip: "Grab (ride-hailing) is cheap and reliable in cities. Between regions, budget domestic flights (AirAsia, Firefly), long-distance buses and the ETS train link major towns quickly and affordably." },
    { id: "etiquette", title: "Local Etiquette", icon: "heart", tip: "Remove shoes before entering homes, mosques and some temples. Dress modestly at religious sites (shoulders and knees covered). Use your right hand for eating and giving/receiving items where possible." },
    { id: "food-safety", title: "Food & Halal", icon: "food", tip: "Malaysia's food is overwhelmingly halal-friendly with excellent hygiene standards at licensed hawker stalls. Look for halal certification stickers if that matters to you, and stay hydrated in the heat." },
    { id: "connectivity", title: "SIM Cards & Wifi", icon: "wifi", tip: "Tourist SIMs (Hotlink, Digi, Maxis) are cheap and available at the airport with strong 4G/5G coverage in cities and most towns; coverage thins out on smaller islands." },
    { id: "tipping", title: "Tipping", icon: "wallet", tip: "Tipping isn't expected — a 10% service charge is usually already added to restaurant bills. Rounding up for great service is appreciated but never required." },
    { id: "safety", title: "Safety", icon: "shield", tip: "Malaysia is generally very safe for travellers. Usual city precautions apply (watch bags in crowds, use licensed taxis/Grab). Swim only at flagged beaches and check conditions before diving or trekking." },
    { id: "best-time", title: "Best Time to Visit", icon: "calendar", tip: "There's no single 'best' season — the West Coast (KL, Penang, Langkawi) is driest Dec–Feb, while the East Coast and islands are best Mar–Sep. Plan your route around the coast you're visiting." },
    { id: "holidays", title: "Public Holidays", icon: "star", tip: "Hari Raya, Chinese New Year and Deepavali bring festive food and events but also heavy domestic travel and higher prices — book transport and hotels well ahead if travelling then." },
  ],

  /* ---------------------------------------------------------------------
     CONTACT INFORMATION
  --------------------------------------------------------------------- */
  contact: {
    email: "hello@jomcuti.my",
    phone: "+60 3-1234 5678",
    whatsapp: "+60 12-345 6789",
    address: "Level 12, Menara Cuti, Jalan Bukit Bintang, 50200 Kuala Lumpur, Malaysia",
    officeHours: "Monday–Friday, 9:00 AM – 6:00 PM (MYT)",
    socialMedia: {
      instagram: "@jomcuti.my",
      facebook: "facebook.com/jomcutimy",
      tiktok: "@jomcuti",
    },
  },
};

/* Expose to both browser (script.js reads window.CONTENT) and Node (for testing) */
if (typeof window !== "undefined") {
  window.CONTENT = CONTENT;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = CONTENT;
}
