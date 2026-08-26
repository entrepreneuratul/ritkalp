// =====================================================================
// DIWALI — full festival config
//
// DRAFT CONTENT: every kit price/item list below is a placeholder
// drafted by Claude, marked `draft: true` and a `// TODO_REVIEW`
// comment. The 5-day guide content (samagri/vidhi/mantra) is a
// reasonable North Indian home-puja tradition, same spirit as the
// Navratri guide, but the user should still read through it before
// launch. Review and edit freely — no component code needs to change.
// =====================================================================

import type { FestivalConfig } from "./types";

export const diwali: FestivalConfig = {
  slug: "diwali",
  nameHindi: "दिवाली",
  nameEnglish: "Diwali",
  seoTitle: "Diwali Puja Kits | Complete Kits Delivered to Your Doorstep",
  seoDescription:
    "आप दीये जलाइए, बाकी सारी व्यवस्था हम कर देंगे — धनतेरस से भाई दूज तक, दिवाली की सारी पूजा सामग्री एक ही जगह। Order in seconds on WhatsApp.",

  theme: {
    primary: {
      DEFAULT: "#C1560E",
      50: "#FDF2E7",
      100: "#FBE0C4",
      200: "#F5BD86",
      300: "#EF9A49",
      400: "#D97620",
      500: "#C1560E",
      600: "#9E440A",
      700: "#7A3308",
      800: "#572406",
      900: "#331503",
    },
    accent: {
      DEFAULT: "#6B2FA0",
      50: "#F3EBFA",
      100: "#E1CBF2",
      200: "#C79BE3",
      300: "#AD6BD4",
      400: "#8B47BD",
      500: "#6B2FA0",
      600: "#552582",
      700: "#3F1B60",
      800: "#2A123F",
      900: "#150920",
    },
    surface: { DEFAULT: "#FFF8ED", soft: "#FFF1DC", deep: "#FCE7C4" },
  },

  hero: {
    headlineHindi: "इस दिवाली, रोशनी का इंतज़ाम हम पर छोड़िए",
    subheadlineHindi: "आप दीये जलाइए, बाकी सारी व्यवस्था हम कर देंगे",
    lineEnglish: "You light the diyas, we'll handle every item of the puja.",
    ctaShopLabel: "Shop Diwali Kits",
    ctaWhatsappLabel: "Chat on WhatsApp",
    heroImage: "/images/diwali/hero.svg",
    trustBadges: [
      { icon: "sparkle", label: "Handpicked & Pure Ingredients" },
      { icon: "truck", label: "Pan-India Delivery" },
      { icon: "chat", label: "Order via WhatsApp — Talk to a Real Person" },
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=5EMTqBMSjw8",
  },

  promise: {
    eyebrow: "Our Promise",
    heading: "Devotion made simple",
    cards: [
      {
        icon: "box",
        title: "Complete Kits for All 5 Days",
        description:
          "From Dhanteras shopping to Bhai Dooj tilak, every item bundled into one kit — no more running between five shops.",
      },
      {
        icon: "leaf",
        title: "Pure & Authentic Samagri",
        description:
          "Handpicked, quality-checked ingredients sourced the traditional way — nothing synthetic, nothing cut corners.",
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
          "Pan-India delivery, timed to reach you well before Dhanteras so you're never rushing on the big night.",
      },
    ],
  },

  kits: {
    eyebrow: "Shop Diwali Kits",
    heading: "Complete kits, not a checklist",
    intro:
      "Pick the kit that matches how you celebrate — from Dhanteras shopping to Bhai Dooj, boxed and ready.",
    items: [
      // TODO_REVIEW: draft kit — verify items & price before launch.
      {
        id: "complete-diwali-box",
        name: "Complete Diwali Box",
        description:
          "Everything you need for all 5 days of Diwali in one box — from Dhanteras to Bhai Dooj.",
        image: "/images/diwali/kits/complete-diwali-box.svg",
        items: [
          "माता लक्ष्मी व गणेश जी की मूर्ति/फोटो",
          "कलश (तांबे/पीतल का) व ढक्कन",
          "चांदी/तांबे का सिक्का व नोट (शुभ प्रतीक)",
          "धनिया के साबुत बीज (धनतेरस विशेष)",
          "मिट्टी के दीये (न्यूनतम 21) व रुई की बत्तियां",
          "सरसों का तेल/घी",
          "रोली, कुमकुम, हल्दी, सिंदूर व अक्षत",
          "सुपारी, लौंग व इलायची",
          "कपूर व धूप/अगरबत्ती",
          "आम के पत्ते व नारियल",
          "कमल/गेंदे की माला व फूल",
          "मिठाई व फल भोग",
          "पंचामृत सामग्री — दूध, दही, घी, शहद, शक्कर",
          "गंगाजल, पूजा की थाली व घंटी",
          "रंगोली रंग",
          "भाई दूज हेतु कलावा/मौली",
          "सभी 5 दिनों के लिए Day-wise पूजा विधि कार्ड",
        ],
        startingPrice: 3499,
        featured: true,
        badge: "Most Popular",
        draft: true,
      },
      // TODO_REVIEW: draft kit — verify items & price before launch.
      {
        id: "dhanteras-kit",
        name: "Dhanteras Shopping Kit",
        description:
          "Everything for Day 1's Dhanvantari-Lakshmi-Kuber puja — set up right before you shop for gold, silver, or new utensils.",
        image: "/images/diwali/kits/dhanteras-kit.svg",
        items: [
          "यम दीपक हेतु मिट्टी का दीया",
          "सरसों का तेल व रुई की बत्तियां",
          "धनिया के साबुत बीज",
          "रोली, अक्षत व फूल",
          "गंगाजल",
          "भगवान धन्वंतरि व कुबेर जी की छोटी तस्वीर",
        ],
        startingPrice: 799,
        draft: true,
      },
      // TODO_REVIEW: draft kit — verify items & price before launch.
      {
        id: "lakshmi-ganesh-puja-kit",
        name: "Lakshmi-Ganesh Puja Kit",
        description:
          "The complete main-night samagri — everything for the most important Lakshmi-Ganesh puja of the year.",
        image: "/images/diwali/kits/lakshmi-puja-kit.svg",
        items: [
          "माता लक्ष्मी व गणेश जी की मूर्ति/फोटो",
          "कलश व नारियल",
          "चांदी का सिक्का/लक्ष्मी सिक्का",
          "कमल का फूल/माला",
          "रोली, कुमकुम, अक्षत व सिंदूर",
          "मिट्टी के दीये (21) व रुई की बत्तियां",
          "पंचामृत सामग्री",
          "मिठाई व फल भोग",
          "इत्र व गंगाजल",
          "लक्ष्मी आरती व चालीसा पुस्तिका",
        ],
        startingPrice: 1299,
        draft: true,
      },
      // TODO_REVIEW: draft kit — verify items & price before launch.
      {
        id: "diya-rangoli-decor-kit",
        name: "Diya & Rangoli Decor Kit",
        description:
          "Light up the house — decorative diyas, rangoli colors, and fairy lights for every corner.",
        image: "/images/diwali/kits/diya-rangoli-decor-kit.svg",
        items: [
          "मिट्टी के सजावटी दीये (सेट)",
          "रंगोली रंग व स्टेंसिल",
          "तोरण/बंदनवार",
          "छोटी LED फेयरी लाइट्स",
          "रुई की बत्तियां व सरसों का तेल",
        ],
        startingPrice: 599,
        draft: true,
      },
      // TODO_REVIEW: draft kit — verify items & price before launch.
      {
        id: "govardhan-annakut-kit",
        name: "Govardhan & Annakut Kit",
        description:
          "Everything for Day 4's Govardhan Puja and Annakut offering — gratitude to nature, made simple.",
        image: "/images/diwali/kits/govardhan-kit.svg",
        items: [
          "श्रीकृष्ण जी की मूर्ति/फोटो",
          "गोवर्धन पर्वत बनाने हेतु शुद्ध मिट्टी",
          "गाय पूजन सामग्री — रोली, फूल, चारा",
          "तुलसी दल व गंगाजल",
          "दीपक व धूप",
        ],
        startingPrice: 449,
        draft: true,
      },
    ],
  },

  // TODO_REVIEW: draft pricing/items for the Kit Builder's extras — same
  // convention as the drafted kits above. Verify before launch.
  builder: {
    eyebrow: "अपनी किट बनाइए",
    heading: "Build Your Own Diwali Kit",
    intro:
      "एक kit चुनें, फिर जो अलग से चाहिए वह टैप करके थाली में जोड़ें — कीमत अपने आप जुड़ती जाएगी।",
    blankBaseLabel: "शुरुआत से बनाएं",
    draft: true,
    categories: [
      {
        id: "lights",
        label: "दीये व रोशनी",
        items: [
          { id: "clay-diyas", name: "मिट्टी के दीये (सेट)", icon: "diya", price: 89 },
          { id: "decorative-lights", name: "सजावटी लाइट्स", icon: "diya", price: 199 },
          { id: "kapoor-agarbatti", name: "कपूर व अगरबत्ती", icon: "incense", price: 49 },
        ],
      },
      {
        id: "bhog",
        label: "मिठाई व भोग",
        items: [
          { id: "sweets", name: "मिठाई", icon: "sweet", price: 149 },
          { id: "dry-fruits", name: "पंचमेवा", icon: "sweet", price: 199 },
          { id: "fruits", name: "मौसमी फल", icon: "fruit", price: 99 },
        ],
      },
      {
        id: "essentials",
        label: "पूजा सामग्री",
        items: [
          { id: "laxmi-ganesh-idol", name: "लक्ष्मी-गणेश मूर्ति", icon: "thali", price: 249 },
          { id: "roli-kumkum", name: "रोली, कुमकुम व हल्दी सेट", icon: "thali", price: 59 },
          { id: "flowers", name: "ताज़े फूल व माला", icon: "flower", price: 79 },
          { id: "kalash-mauli", name: "कलश व मौली", icon: "kalash", price: 199 },
        ],
      },
    ],
  },

  dayGuide: {
    sectionId: "five-days",
    navLabel: "5 Days Guide",
    eyebrow: "Panch Din, Panch Parv",
    heading: "5 Days of Diwali, Explained",
    intro:
      "Each of the five days has its own significance and puja. Tap a day to learn its story and how it's traditionally observed.",
    mainSamagriHeading: "दिवाली की मुख्य सामग्री",
    mainSamagriSubheading:
      "इनमें से अधिकांश चीज़ें धनतेरस से भाई दूज तक रोज़ काम आएंगी — एक बार में खरीद लें।",
    mainSamagri: [
      "माता लक्ष्मी व गणेश जी की फोटो/मूर्ति",
      "पूजा की चौकी",
      "लाल कपड़ा/आसन",
      "मिट्टी के दीये",
      "सरसों का तेल/घी",
      "रुई की बत्तियां",
      "माचिस/लाइटर",
      "रोली",
      "कुमकुम",
      "हल्दी",
      "सिंदूर",
      "अक्षत (चावल)",
      "चंदन",
      "सुपारी",
      "लौंग व इलायची",
      "कपूर",
      "धूप/अगरबत्ती",
      "गंगाजल",
      "पूजा की थाली व घंटी",
      "फूल व माला",
      "फल",
      "मिठाई",
      "पंचामृत की सामग्री — दूध, दही, घी, शहद, शक्कर",
      "रंगोली रंग",
      "कलावा/मौली",
    ],
    dailyQuickVidhiHeading: "रोज़ की छोटी पूजा (15–30 मिनट)",
    dailyQuickVidhi: [
      "स्नान",
      "पूजा स्थान साफ",
      "दीपक",
      "धूप",
      "गणेश स्मरण",
      "उस दिन के देवता का ध्यान",
      "रोली/अक्षत/फूल",
      "भोग",
      "मंत्र/स्तोत्र पाठ",
      "आरती",
      "प्रसाद",
    ],
    samagriNote:
      "भोग की चीज़ें और सामग्री की सूची अलग-अलग क्षेत्रों और पारिवारिक परंपराओं में बदलती है — अपनी परंपरा के अनुसार बदलाव करें।",
    bannerImage: "/images/diwali/banner.svg",
    bannerEyebrow: "Panch Din, Panch Parv",
    bannerHeading: "दिवाली के पांच दिन, एक साथ",
    bannerLinkText: "5 Days Guide",
    days: [
      {
        dayNumber: 1,
        dateLabel: "Day 1",
        nameHindi: "धनतेरस",
        nameEnglish: "Dhanteras",
        epithet: "Wealth & Well-Being — Dhanvantari Puja",
        significance:
          "Dhanteras opens the five-day Diwali festival, dedicated to Lord Dhanvantari (the god of health and Ayurveda) along with Goddess Lakshmi and Kuber. Families traditionally buy new utensils, gold, or silver on this day as a symbol of lasting prosperity, and light a diya at the entrance in the evening (Yamadeepdan) to pray for protection from untimely death.",
        samagri: [
          "नए बर्तन या सिक्का (धातु)",
          "यम दीपक हेतु मिट्टी का दीया",
          "सरसों का तेल",
          "रुई की बत्ती",
          "धनिया के साबुत बीज",
          "गंगाजल",
          "रोली, अक्षत व फूल",
          "मिठाई",
        ],
        vidhiSteps: [
          "शाम को घर के मुख्य द्वार पर एक दीपक जलाएं (यम दीपक) — दक्षिण दिशा की ओर मुख करके रखें।",
          "पूजा स्थान साफ करके भगवान धन्वंतरि व माता लक्ष्मी-कुबेर की तस्वीर/मूर्ति स्थापित करें।",
          "नए खरीदे बर्तन/सिक्के को गंगाजल से शुद्ध करके पूजा स्थान पर रखें।",
          "रोली, अक्षत और फूल अर्पित करें।",
          "धनिया के साबुत बीज भगवान को अर्पित करें — समृद्धि का प्रतीक माने जाते हैं।",
          "धूप-दीप करके आरती करें।",
          "परिवार सहित अच्छे स्वास्थ्य और समृद्धि की प्रार्थना करें।",
        ],
        mantra: "ॐ धन्वन्तरये नमः।",
        image: "/images/diwali/days/dhanteras.svg",
        youtubeUrl: "https://www.youtube.com/watch?v=85e577dXlz0",
        kitPrice: 599,
      },
      {
        dayNumber: 2,
        dateLabel: "Day 2 · Chhoti Diwali",
        nameHindi: "नरक चतुर्दशी",
        nameEnglish: "Naraka Chaturdashi",
        epithet: "The Eve of Light — Abhyanga Snan",
        significance:
          "Also called Chhoti Diwali, this day commemorates Lord Krishna's victory over the demon Narakasura. Families perform a ritual oil bath (Abhyanga Snan) before sunrise for purification and well-being, and homes are decorated with diyas and rangoli in preparation for the main Diwali night ahead.",
        samagri: [
          "उबटन/तेल स्नान सामग्री (सरसों या तिल का तेल)",
          "हल्दी व चंदन",
          "14 मिट्टी के दीये",
          "सरसों का तेल/घी",
          "रुई की बत्तियां",
          "रंगोली रंग",
        ],
        vidhiSteps: [
          "सूर्योदय से पहले उठकर तिल/सरसों के तेल से उबटन लगाकर स्नान करें (अभ्यंग स्नान)।",
          "घर के मुख्य द्वार व आँगन में रंगोली बनाएं।",
          "शाम को घर के हर कोने में — विशेषकर तुलसी के पास, आँगन में और मुख्य द्वार पर — 14 दीये जलाएं।",
          "यम व श्रीकृष्ण भगवान का स्मरण करते हुए दीप जलाएं।",
          "घर की साफ-सफाई पूरी करें ताकि अगले दिन लक्ष्मी पूजन के लिए घर तैयार हो।",
        ],
        mantra: "ॐ नरकान्तकाय नमः।",
        image: "/images/diwali/days/naraka-chaturdashi.svg",
        youtubeUrl: "https://www.youtube.com/watch?v=NwXrnoXOoQg",
        kitPrice: 349,
      },
      {
        dayNumber: 3,
        dateLabel: "Day 3 · Main Night",
        nameHindi: "दीपावली · लक्ष्मी पूजा",
        nameEnglish: "Diwali — Lakshmi-Ganesh Puja",
        epithet: "The Main Night — Wealth, Wisdom & New Beginnings",
        significance:
          "The main night of Diwali, when Goddess Lakshmi (wealth) and Lord Ganesh (wisdom and auspicious beginnings) are worshipped together at dusk — along with Goddess Saraswati and Kuber in many households. Homes are lit with rows of diyas (giving the festival its name, Deepavali — a row of lights) to welcome Lakshmi in, and the main puja is traditionally performed after sunset for lasting prosperity through the year.",
        samagri: [
          "माता लक्ष्मी व गणेश जी की मूर्ति/फोटो",
          "चौकी व लाल कपड़ा",
          "कलश व नारियल",
          "आम के पत्ते",
          "रोली, कुमकुम, अक्षत, हल्दी व सिंदूर",
          "सुपारी, लौंग व इलायची",
          "कमल का फूल/माला",
          "मिठाई व फल भोग",
          "पंचामृत सामग्री",
          "चांदी का सिक्का",
          "दीपक व घी, धूप-अगरबत्ती",
          "कपूर",
        ],
        vidhiSteps: [
          "शाम को सूर्यास्त के बाद, घर व मंदिर की सफाई करके पूजा स्थान पर चौकी लगाएं।",
          "चौकी पर लाल कपड़ा बिछाकर माता लक्ष्मी व गणेश जी की मूर्ति/फोटो स्थापित करें।",
          "कलश स्थापित करें और उसमें जल, अक्षत, सिक्का व सुपारी डालें।",
          "सबसे पहले गणेश जी का पूजन करें — रोली, अक्षत, दूर्वा अर्पित करें।",
          "माता लक्ष्मी को कमल का फूल, अक्षत, सिंदूर व मिठाई अर्पित करें।",
          "बही-खाते/तिजोरी की पूजा करें (व्यापारी परिवार अपनी परंपरा अनुसार)।",
          "पंचामृत व मिठाई का भोग लगाएं।",
          "दीपक व धूप जलाकर लक्ष्मी चालीसा/स्तोत्र का पाठ करें।",
          "माता लक्ष्मी व गणेश जी की आरती करें।",
          "घर के हर कमरे व मुख्य द्वार पर दीये जलाएं।",
        ],
        mantra: "ॐ श्रीं ह्रीं क्लीं महालक्ष्म्यै नमः।",
        additionalSection: {
          title: "लक्ष्मी-गणेश पूजन की विशेष सामग्री (मुख्य रात्रि विशेष)",
          note:
            "यह रात्रि दीपावली की सबसे महत्वपूर्ण पूजा है — पूरे परिवार के लिए समृद्धि और नई शुरुआत का प्रतीक।",
          samagri: [
            "चांदी/तांबे का कलश",
            "कमल या गुलाब के फूल",
            "चांदी का सिक्का/लक्ष्मी सिक्का",
            "बही-खाता व कलम — व्यापारी परिवारों हेतु",
            "मिट्टी के दीये (न्यूनतम 21)",
            "रुई की बत्तियां",
            "गंगाजल व इत्र",
          ],
        },
        image: "/images/diwali/days/lakshmi-puja.svg",
        youtubeUrl: "https://www.youtube.com/watch?v=TJrKM8JiOHQ",
        kitPrice: 999,
      },
      {
        dayNumber: 4,
        dateLabel: "Day 4",
        nameHindi: "गोवर्धन पूजा",
        nameEnglish: "Govardhan Puja (Annakut)",
        epithet: "Gratitude to Nature — The Mountain of Food",
        significance:
          "The day after the main Diwali night commemorates Lord Krishna lifting Govardhan Parvat to shelter villagers from Indra's wrath — a celebration of gratitude toward nature, cattle, and the food that sustains us. Families build a small Govardhan mound from cow dung or clay and offer Annakut, a mountain of food items, to Krishna.",
        samagri: [
          "गोबर या शुद्ध मिट्टी — गोवर्धन पर्वत बनाने हेतु",
          "गाय पूजन सामग्री — रोली, फूल, चारा",
          "श्रीकृष्ण जी की मूर्ति/फोटो",
          "दीपक व धूप",
          "अन्नकूट हेतु विविध पकवान/सब्ज़ियां",
          "तुलसी दल व गंगाजल",
        ],
        vidhiSteps: [
          "आँगन या पूजा स्थान में गोबर या मिट्टी से गोवर्धन पर्वत की आकृति बनाएं।",
          "उसे फूलों, दूर्वा व चारे से सजाएं।",
          "श्रीकृष्ण जी को गोवर्धन पर्वत उठाए हुए स्मरण करते हुए पूजा करें।",
          "रोली, अक्षत व फूल अर्पित करें।",
          "अन्नकूट के रूप में कई प्रकार के पकवान/सब्ज़ियां भोग स्वरूप अर्पित करें।",
          "गाय की पूजा करें व उसे चारा खिलाएं।",
          "परिक्रमा करके आरती करें।",
        ],
        mantra: "ॐ गोवर्धनधराय नमः।",
        image: "/images/diwali/days/govardhan-puja.svg",
        youtubeUrl: "https://www.youtube.com/watch?v=bQ2I_ljk0bE",
        kitPrice: 449,
      },
      {
        dayNumber: 5,
        dateLabel: "Day 5",
        nameHindi: "भाई दूज",
        nameEnglish: "Bhai Dooj (Yama Dwitiya)",
        epithet: "The Bond of Brother & Sister",
        significance:
          "The final day of Diwali celebrates the bond between brothers and sisters, in a spirit similar to Raksha Bandhan. Sisters perform an aarti for their brothers, apply tilak, and pray for their long life and well-being, while brothers give gifts in return — legend ties the day to Yamraj visiting his sister Yamuna.",
        samagri: [
          "रोली/कुमकुम व अक्षत",
          "नारियल",
          "मिठाई",
          "आरती की थाली व दीपक",
          "कलावा/मौली",
          "फूल",
        ],
        vidhiSteps: [
          "बहन स्नान करके पूजा की थाली सजाए — रोली, अक्षत, दीपक, नारियल व मिठाई के साथ।",
          "भाई को आसन पर बिठाकर सबसे पहले तिलक करें।",
          "भाई की आरती उतारें।",
          "भाई की कलाई पर कलावा/मौली बाँधें।",
          "भाई को मिठाई खिलाएं और उसकी लंबी आयु व सुख-समृद्धि की कामना करें।",
          "भाई अपनी सामर्थ्य अनुसार बहन को उपहार/शगुन दें।",
        ],
        mantra:
          "गंगा पूजे यमुना को, यमुना पूजे यमराज को; उतनी देर जीवे भैया मेरा, जितने कुरुक्षेत्र में साज को।",
        image: "/images/diwali/days/bhai-dooj.svg",
        youtubeUrl: "https://www.youtube.com/watch?v=vXFBHxg-PBU",
        kitPrice: 399,
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
    heading: "Ready to light up this Diwali?",
    line:
      "Message us on WhatsApp and we'll help you pick the right kit — no forms, no accounts, just a conversation.",
  },

  footerTagline: "You light the diyas, we'll handle every item of the puja.",
  whatsappCollectionName: "Diwali",

  about: {
    heading: "हमारे बारे में",
    tagline: "रोशनी के त्योहार में, आपकी सुविधा का साथ",
    paragraphs: [
      "दिवाली हमारे लिए सिर्फ एक त्योहार नहीं, धनतेरस से भाई दूज तक — पांच दिनों की आस्था, समृद्धि और अपनों के साथ का पर्व है।",
      "हम जानते हैं कि हर दिन की अपनी अलग पूजा सामग्री जुटाना — नए बर्तन, दीये, रंगोली रंग, कलश सामग्री — कई बार वक्त और मेहनत माँगता है, वो भी तब जब घर की साफ-सफाई और तैयारियां पहले से ही व्यस्त रखती हैं।",
      "हमारा उद्देश्य है कि दिवाली के हर दिन की जरूरी सामग्री आपको एक ही जगह आसानी से मिल जाए, ताकि आपको बार-बार बाज़ार न जाना पड़े।",
    ],
    calloutQuote: [
      "आपका समय खरीदारी में नहीं,",
      "दीये जलाने और अपनों के साथ बिताने में लगे — यही हमारी कोशिश है।",
    ],
    closingHeading: "आपकी तैयारी, हमारी जिम्मेदारी",
    closingParagraph:
      "हर सामग्री के पीछे हमारा प्रयास यही है कि जब आप लक्ष्मी पूजन करें, तो आपके मन में सिर्फ श्रद्धा और उत्सव का उल्लास हो — सामान जुटाने की चिंता नहीं।",
    closingCouplet: ["दिवाली की तैयारी हम पर छोड़िए,", "रोशनी और खुशियां आप पर।"],
    finalPhrase: "शुभ दीपावली",
  },

  dateHint: { fromMonth: 10, toMonth: 11 },
};
