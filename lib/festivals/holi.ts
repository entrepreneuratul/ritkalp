// =====================================================================
// HOLI — full festival config
//
// DRAFT CONTENT: lighter-scoped than Navratri/Diwali, as agreed —
// two-part guide (Holika Dahan + Rangwali Holi) with standard,
// judgment-based items. Every kit price/item list is a placeholder,
// marked `draft: true` and `// TODO_REVIEW`. Review before launch.
// =====================================================================

import type { FestivalConfig } from "./types";

export const holi: FestivalConfig = {
  slug: "holi",
  nameHindi: "होली",
  nameEnglish: "Holi",
  seoTitle: "Holi Puja & Color Kits | Complete Kits Delivered to Your Doorstep",
  seoDescription:
    "आप रंग खेलिए, बाकी सारी व्यवस्था हम कर देंगे — होलिका दहन से रंगवाली होली तक, सारी सामग्री एक ही जगह। Order in seconds on WhatsApp.",

  theme: {
    primary: {
      DEFAULT: "#D6316C",
      50: "#FDECF2",
      100: "#FBD0E0",
      200: "#F5A0C1",
      300: "#EE71A3",
      400: "#E44884",
      500: "#D6316C",
      600: "#AD2758",
      700: "#841D43",
      800: "#5C142F",
      900: "#330A1A",
    },
    accent: {
      DEFAULT: "#4C9A4A",
      50: "#EEF8ED",
      100: "#D3EED0",
      200: "#A8DDA2",
      300: "#7CCB74",
      400: "#5EAF57",
      500: "#4C9A4A",
      600: "#3C7C3B",
      700: "#2C5D2C",
      800: "#1D3F1D",
      900: "#0E200E",
    },
    surface: { DEFAULT: "#FFFBF2", soft: "#FFF6E0", deep: "#FCEBC0" },
  },

  hero: {
    headlineHindi: "इस होली, रंगों की चिंता छोड़िए",
    subheadlineHindi: "आप रंग खेलिए, बाकी सारी व्यवस्था हम कर देंगे",
    lineEnglish: "You play the colors, we'll handle every item of the puja.",
    ctaShopLabel: "Shop Holi Kits",
    ctaWhatsappLabel: "Chat on WhatsApp",
    heroImage: "/images/holi/hero.svg",
    trustBadges: [
      { icon: "sparkle", label: "Handpicked & Pure Ingredients" },
      { icon: "truck", label: "Pan-India Delivery" },
      { icon: "chat", label: "Order via WhatsApp — Talk to a Real Person" },
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=BOikueXAH3Y",
  },

  promise: {
    eyebrow: "Our Promise",
    heading: "Celebration made simple",
    cards: [
      {
        icon: "box",
        title: "Complete Kits for Both Days",
        description:
          "Holika Dahan samagri and Rangwali Holi colors, bundled into one kit — no more running between five shops.",
      },
      {
        icon: "leaf",
        title: "Pure, Skin-Safe Colors",
        description:
          "Organic gulal and handpicked, quality-checked samagri — nothing synthetic, nothing cut corners.",
      },
      {
        icon: "chat",
        title: "Order in Seconds via WhatsApp",
        description:
          "No accounts, no cart, no payment gateway. Tap a button, send a message, and we take it from there.",
      },
      {
        icon: "door",
        title: "Delivered to Your Doorstep",
        description:
          "Pan-India delivery, timed to reach you well before Holika Dahan so you're never rushing.",
      },
    ],
  },

  kits: {
    eyebrow: "Shop Holi Kits",
    heading: "Complete kits, not a checklist",
    intro:
      "Pick the kit that matches how you celebrate — from Holika Dahan samagri to a full day of colors, boxed and ready.",
    items: [
      // TODO_REVIEW: draft kit — verify items & price before launch.
      {
        id: "complete-holi-combo",
        name: "Complete Holi Combo",
        description:
          "Everything for both days — Holika Dahan puja samagri plus a full Rangwali Holi color kit.",
        image: "/images/holi/kits/complete-holi-combo.svg",
        items: [
          "गोबर के उपले/कंडे व गोमय बत्ती",
          "कच्चा सूत, हल्दी-अक्षत, रोली-मौली",
          "नारियल व गुड़/मिठाई नैवेद्य",
          "ऑर्गेनिक गुलाल (5 रंग)",
          "पिचकारी",
          "गुझिया/मिठाई का सामान",
        ],
        startingPrice: 799,
        featured: true,
        badge: "Most Popular",
        draft: true,
      },
      // TODO_REVIEW: draft kit — verify items & price before launch.
      {
        id: "holika-dahan-kit",
        name: "Holika Dahan Kit",
        description:
          "Everything for Day 1's Holika Dahan puja — set it up right, without hunting for items.",
        image: "/images/holi/kits/holika-dahan-kit.svg",
        items: [
          "गोबर के उपले/कंडे",
          "गोमय बत्ती (उपलों की माला)",
          "कच्चा सूत (सूती धागा)",
          "हल्दी व अक्षत",
          "रोली व मौली",
          "नारियल व गुड़",
        ],
        startingPrice: 399,
        draft: true,
      },
      // TODO_REVIEW: draft kit — verify items & price before launch.
      {
        id: "rangwali-holi-kit",
        name: "Rangwali Holi Kit",
        description:
          "Organic, skin-safe gulal in five colors plus a pichkari — ready for a full day of colors.",
        image: "/images/holi/kits/rangwali-holi-kit.svg",
        items: [
          "ऑर्गेनिक गुलाल (5 रंग)",
          "पिचकारी",
          "छोटी बाल्टी",
          "रंग खेलने हेतु टोपी/चश्मा",
        ],
        startingPrice: 499,
        draft: true,
      },
    ],
  },

  // TODO_REVIEW: draft pricing/items for the Kit Builder's extras — same
  // convention as the drafted kits above. Verify before launch.
  builder: {
    eyebrow: "अपनी किट बनाइए",
    heading: "Build Your Own Holi Kit",
    intro:
      "एक kit चुनें, फिर जो अलग से चाहिए वह टैप करके थाली में जोड़ें — कीमत अपने आप जुड़ती जाएगी।",
    blankBaseLabel: "शुरुआत से बनाएं",
    draft: true,
    categories: [
      {
        id: "colors",
        label: "गुलाल व रंग",
        items: [
          { id: "organic-gulal", name: "ऑर्गेनिक गुलाल (1 रंग)", icon: "flower", price: 59 },
          { id: "pichkari", name: "पिचकारी", icon: "thali", price: 149 },
          { id: "water-balloons", name: "वाटर बैलून पैक", icon: "fruit", price: 49 },
        ],
      },
      {
        id: "puja",
        label: "होलिका पूजन",
        items: [
          { id: "holika-thread", name: "होलिका पूजन कच्चा सूत", icon: "thali", price: 29 },
          { id: "coconut", name: "नारियल", icon: "coconut", price: 39 },
          { id: "sweets", name: "गुजिया व मिठाई", icon: "sweet", price: 149 },
        ],
      },
    ],
  },

  dayGuide: {
    sectionId: "holi-guide",
    navLabel: "Holi Guide",
    eyebrow: "Do Din, Do Rang",
    heading: "Holi, Explained",
    intro:
      "Holi unfolds over two nights and days. Tap either to learn its story and how it's traditionally observed.",
    mainSamagriHeading: "होली की मुख्य सामग्री",
    mainSamagriSubheading:
      "इनमें से अधिकांश चीज़ें होलिका दहन व रंगवाली होली दोनों दिन काम आएंगी — एक बार में खरीद लें।",
    mainSamagri: [
      "गोबर के उपले/कंडे",
      "कच्चा सूत",
      "हल्दी व अक्षत",
      "रोली व मौली",
      "नारियल",
      "गुड़/मिठाई",
      "ऑर्गेनिक गुलाल",
      "पिचकारी",
      "पानी की बाल्टी",
      "जल का लोटा",
    ],
    dailyQuickVidhiHeading: "छोटी पूजा (15–20 मिनट)",
    dailyQuickVidhi: [
      "स्नान",
      "पूजा स्थान/स्थल साफ",
      "जल-रोली-अक्षत अर्पण",
      "नारियल व गुड़ का भोग",
      "परिक्रमा/प्रार्थना",
      "प्रसाद",
    ],
    samagriNote:
      "सामग्री की सूची अलग-अलग क्षेत्रों और पारिवारिक परंपराओं में बदलती है — अपनी परंपरा के अनुसार बदलाव करें।",
    bannerImage: "/images/holi/banner.svg",
    bannerEyebrow: "Do Din, Do Rang",
    bannerHeading: "होली के दो दिन, एक साथ",
    bannerLinkText: "Holi Guide",
    days: [
      {
        dayNumber: 1,
        dateLabel: "Day 1 · Evening",
        nameHindi: "होलिका दहन",
        nameEnglish: "Holika Dahan",
        epithet: "The Bonfire of Good Over Evil",
        significance:
          "On the night before Holi, families light a bonfire — Holika Dahan — commemorating the legend of Prahlad and Holika, a celebration of good triumphing over evil. People circle the fire, offer grains and coconut, and take home a pinch of ash the next morning as a blessing.",
        samagri: [
          "गोबर के उपले/कंडे",
          "गोमय बत्ती (उपलों की माला)",
          "कच्चा सूत (सूती धागा)",
          "हल्दी व अक्षत",
          "रोली व मौली",
          "नारियल",
          "गुड़/मिठाई — नैवेद्य हेतु",
          "जल का लोटा",
        ],
        vidhiSteps: [
          "शाम को होलिका दहन स्थल पर उपलों/लकड़ियों से होलिका सजाएं।",
          "होलिका के चारों ओर कच्चे सूत को 7 या 11 बार लपेटें।",
          "जल, रोली, अक्षत व हल्दी अर्पित करें।",
          "नारियल व गुड़ का भोग अर्पित करें।",
          "शुभ मुहूर्त में होलिका दहन करें और अग्नि की परिक्रमा करें।",
          "परिवार सहित बुराई पर अच्छाई की जीत की प्रार्थना करें।",
          "अगली सुबह भस्म को माथे पर लगाकर आशीर्वाद स्वरूप ग्रहण करें।",
        ],
        mantra: "ॐ होलिकायै नमः।",
        image: "/images/holi/days/holika-dahan.svg",
        youtubeUrl: "https://www.youtube.com/watch?v=e-PLVJFhAgI",

        kitPrice: 399,
      },
      {
        dayNumber: 2,
        dateLabel: "Day 2",
        nameHindi: "रंगवाली होली",
        nameEnglish: "Rangwali Holi",
        epithet: "The Festival of Colors",
        significance:
          "The main day of Holi — celebrated with organic gulal, water, and pichkaris, marking the arrival of spring and the playful bond between Radha and Krishna. Families and friends gather to apply colors, share festive treats like gujiya and thandai, and let go of old grudges.",
        samagri: [
          "ऑर्गेनिक गुलाल/रंग — कई रंग",
          "पिचकारी",
          "पानी की बाल्टी",
          "गुझिया/मिठाई",
          "ठंडाई सामग्री",
          "पुराने/हल्के कपड़े",
        ],
        vidhiSteps: [
          "सुबह स्नान करके पुराने/हल्के कपड़े पहनें।",
          "सबसे पहले घर के बड़ों को गुलाल लगाकर आशीर्वाद लें।",
          "परिवार व मित्रों के साथ रंग व पानी से होली खेलें।",
          "भगवान राधा-कृष्ण का स्मरण करें।",
          "गुझिया, मिठाई व ठंडाई का आनंद लें।",
          "शाम को स्नान करके एक-दूसरे को होली की शुभकामनाएं दें।",
        ],
        image: "/images/holi/days/rangwali-holi.svg",
        youtubeUrl: "https://www.youtube.com/watch?v=BCCN2T7jSjo",
        kitPrice: 349,
      },
    ],
  },

  trust: {
    eyebrow: "Why Trust Us",
    heading: "Trusted Across India",
    stats: [
      { value: "500+", label: "Kits Delivered" },
      { value: "15+", label: "Cities Served" },
      { value: "4.8★", label: "Customer Rating" },
    ],
    // No testimonials yet — deliberately left empty rather than
    // filled with fabricated customer quotes/names. StatsAndTestimonials.tsx
    // hides the testimonials grid entirely when this is empty, so the
    // stats strip above still renders cleanly. Add real ones here
    // (verbatim quote + real name + real city) as they come in.
    testimonials: [],
  },

  finalCta: {
    heading: "Ready to celebrate a colorful Holi?",
    line:
      "Message us on WhatsApp and we'll help you pick the right kit — no forms, no accounts, just a conversation.",
  },

  footerTagline: "You play the colors, we'll handle every item of the puja.",
  whatsappCollectionName: "Holi",

  about: {
    heading: "हमारे बारे में",
    tagline: "रंगों के त्योहार में, आपकी सुविधा का साथ",
    paragraphs: [
      "होली हमारे लिए सिर्फ एक त्योहार नहीं, बुराई पर अच्छाई की जीत और अपनों के साथ खुशियां बांटने का पर्व है।",
      "हम जानते हैं कि होलिका दहन की सामग्री जुटाना और अच्छी गुणवत्ता के रंग ढूंढना — दोनों में समय लगता है, खासकर जब त्योहार करीब हो।",
      "हमारा उद्देश्य है कि होली की जरूरी सामग्री — चाहे होलिका दहन की हो या रंग खेलने की — आपको एक ही जगह आसानी से मिल जाए।",
    ],
    calloutQuote: [
      "आपका समय खरीदारी में नहीं,",
      "रंगों और अपनों के साथ हंसी-ठिठोली में लगे — यही हमारी कोशिश है।",
    ],
    closingHeading: "आपकी तैयारी, हमारी जिम्मेदारी",
    closingParagraph:
      "हर सामग्री के पीछे हमारा प्रयास यही है कि जब आप होली मनाएं, तो आपके मन में सिर्फ उत्सव का उल्लास हो — सामान जुटाने की चिंता नहीं।",
    closingCouplet: ["होली की तैयारी हम पर छोड़िए,", "रंग और खुशियां आप पर।"],
    finalPhrase: "होली है!",
  },

  dateHint: { fromMonth: 3, toMonth: 3 },
};
