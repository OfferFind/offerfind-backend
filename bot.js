// Import Required Packages
require('dotenv').config({ path: './.env' });
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const ogs = require('open-graph-scraper');

// Load Environment Variables
const BOT_TOKEN = process.env.BOT_TOKEN;
const SOURCE_CHAT_ID_1 = process.env.SOURCE_CHAT_ID_1;
const SOURCE_CHAT_ID_2 = process.env.SOURCE_CHAT_ID_2;
const DESTINATION_CHAT_ID = process.env.DESTINATION_CHAT_ID;
const API_URL = process.env.API_URL;

if (!BOT_TOKEN || !SOURCE_CHAT_ID_1 || !SOURCE_CHAT_ID_2 || !DESTINATION_CHAT_ID || !API_URL) {
    console.error('❌ Error: One or more environment variables are missing!');
    process.exit(1);
}

// Create Telegram Bot Instance
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.on('channel_post', async (msg) => {
    const chatId = msg.chat.id;
    console.log(`📡 New post received from Chat ID: ${chatId}`);

    if (chatId == DESTINATION_CHAT_ID) {
        console.log(`📩 New Post from Ecommerce Website Group`);

        try {
            const messageText = msg.text || '';
            const messageLink = extractLink(messageText);
            const imageUrl = messageLink ? await fetchImageFromLink(messageLink) : '';

            const offerData = {
                source: "Amazon or Flipkart" || 'Ecommerce Website Group',
                message: messageText,
                link: messageLink,
                image: imageUrl,
                category: getCategory(messageText),
                date: new Date().toISOString(),
            };

            await axios.post(`${API_URL}/api/save-offer`, offerData);
            console.log('✅ Offer sent to website API successfully!');
        } catch (error) {
            console.error('❌ Error sending offer to API:', error.message);
        }
    }
});

// 🔗 Extract Link
function extractLink(message) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const links = message.match(urlRegex);
    return links ? links[0] : '';
}

// 🖼️ Fetch Image from OpenGraph Meta
async function fetchImageFromLink(url) {
    try {
        const options = { url };
        const { result } = await ogs(options);
        return result.ogImage?.url || '';
    } catch (err) {
        console.warn('⚠️ Image fetch failed:', err.message);
        return '';
    }
}

// 📦 Category Detection
function getCategory(message) {
    const lowerMsg = message.toLowerCase();

    // Clothes and Fashion
    if (lowerMsg.match(/shirt|jeans|t-shirt|dress|kurti|saree|lehenga|jacket|suit|blazer|shorts|trousers|hoodie|skirt|sweater|cardigan|coat|gown|ethnic wear|formal wear|casual wear|Shirt|Jeans|T-Shirt|Dress|Kurti|Saree|Lehenga|Jacket|Suit|Blazer|Shorts|Trousers|Hoodie|Skirt|Sweater|Cardigan|Coat|Gown|Ethnic Wear|Formal Wear|Casual Wear/)) 
        return 'Clothes and Fashion';

    // Footwear
    if (lowerMsg.match(/shoes|sneaker|footwear|sandals|slippers|boots|heels|flip-flops|loafers|sports shoes|formal shoes|casual shoes|running shoes|Shoes|Sneaker|Footwear|Sandals|Slippers|Boots|Heels|Flip-Flops|Loafers|Sports Shoes|Formal Shoes|Casual Shoes|Running Shoes/)) 
        return 'Footwear';

    // Electronics and Gadgets
    if (lowerMsg.match(/phone|laptop|vivobook|ryzen|stand|gadget|electronics|earbuds|headphones|charger|power bank|camera|tablet|mouse|keyboard|monitor|printer|smartwatch|tv|television|router|modem|speaker|gaming console|drone|projector|Phone|Laptop|Vivobook|Ryzen|Stand|Gadget|Electronics|Earbuds|Headphones|Charger|Power Bank|Camera|Tablet|Mouse|Keyboard|Monitor|Printer|Smartwatch|Tv|Television|Router|Modem|Speaker|Gaming Console|Drone|Projector/)) 
        return 'Electronics';

    // Beauty and Personal Care
    if (lowerMsg.match(/cream|shampoo|soap|lotion|beauty|personal care|makeup|skincare|gel|wash|nivea|face|body lotion|deodorant|sunscreen|facewash|scrub|lipstick|perfume|serum|nail polish|hair oil|conditioner|foundation|eyeliner|mascara|Cream|Shampoo|Soap|Lotion|Beauty|Personal Care|Makeup|Skincare|Gel|Wash|Nivea|Face|Body Lotion|Deodorant|Sunscreen|Facewash|Scrub|Lipstick|Perfume|Serum|Nail Polish|Hair Oil|Conditioner|Foundation|Eyeliner|Mascara/)) 
        return 'Beauty and Personal Care';

    // Health and Wellness
    if (lowerMsg.match(/protein|vitamin|supplement|gym|workout|medicine|health|weight|immunity|fitness|yoga mat|dumbbell|treadmill|exercise bike|first aid|bandage|sanitizer|mask|thermometer|bp monitor|Protein|Vitamin|Supplement|Gym|Workout|Medicine|Health|Weight|Immunity|Fitness|Yoga Mat|Dumbbell|Treadmill|Exercise Bike|First Aid|Bandage|Sanitizer|Mask|Thermometer|Bp Monitor/)) 
        return 'Health and Wellness';

    // Home and Kitchen
    if (lowerMsg.match(/furniture|sofa|table|chair|mattress|pillow|curtain|cookware|kitchenware|appliance|storage|organizer|bed sheet|towel|microwave|refrigerator|washing machine|air conditioner|fan|heater|vacuum cleaner|blender|toaster|grill|dishwasher|water purifier|Furniture|Sofa|Table|Chair|Mattress|Pillow|Curtain|Cookware|Kitchenware|Appliance|Storage|Organizer|Bed Sheet|Towel|Microwave|Refrigerator|Washing Machine|Air Conditioner|Fan|Heater|Vacuum Cleaner|Blender|Toaster|Grill|Dishwasher|Water Purifier/)) 
        return 'Home and Kitchen';

    // Grocery and Gourmet
    if (lowerMsg.match(/rice|oil|flour|sugar|spices|grocery|snacks|beverage|chocolate|coffee|tea|biscuits|juice|cereal|pasta|noodles|soup|sauce|jam|honey|baking|dairy|cheese|butter|milk|eggs|meat|fish|frozen|Rice|Oil|Flour|Sugar|Spices|Grocery|Snacks|Beverage|Chocolate|Coffee|Tea|Biscuits|Juice|Cereal|Pasta|Noodles|Soup|Sauce|Jam|Honey|Baking|Dairy|Cheese|Butter|Milk|Eggs|Meat|Fish|Frozen Food/)) 
        return 'Grocery and Gourmet';

// Toys and Baby Products
if (lowerMsg.match(/toy|lego|doll|baby|kids|stroller|diaper|feeding|playset|soft toy|action figure|puzzle|board game|crib|baby monitor|baby clothes|baby shoes|teether|rattle|baby carrier|Toy|Lego|Doll|Baby|Kids|Stroller|Diaper|Feeding|Playset|Soft Toy|Action Figure|Puzzle|Board Game|Crib|Baby Monitor|Baby Clothes|Baby Shoes|Teether|Rattle|Baby Carrier/)) 
    return 'Toys and Baby Products';

// Sports and Outdoors
if (lowerMsg.match(/sports|cricket|football|bat|racket|shuttlecock|gym equipment|outdoor|fitness gear|bicycle|tent|camping|hiking|fishing|kayak|skateboard|roller skates|helmet|jersey|gloves|sportswear|Sports|Cricket|Football|Bat|Racket|Shuttlecock|Gym Equipment|Outdoor|Fitness Gear|Bicycle|Tent|Camping|Hiking|Fishing|Kayak|Skateboard|Roller Skates|Helmet|Jersey|Gloves|Sportswear/)) 
    return 'Sports and Outdoors';

// Books and Stationery
if (lowerMsg.match(/book|novel|stationery|pen|notebook|textbook|study|paper|journal|diary|highlighter|marker|eraser|sharpener|ruler|calculator|file|folder|art supplies|paint|canvas|craft|Book|Novel|Stationery|Pen|Notebook|Textbook|Study|Paper|Journal|Diary|Highlighter|Marker|Eraser|Sharpener|Ruler|Calculator|File|Folder|Art Supplies|Paint|Canvas|Craft/)) 
    return 'Books and Stationery';

// Automotive and Accessories
if (lowerMsg.match(/car|bike|automobile|helmet|tyre|accessory|wiper|seat cover|car polish|air freshener|car charger|dashboard camera|car vacuum|bike cover|car mat|engine oil|tool kit|spare parts|Car|Bike|Automobile|Helmet|Tyre|Accessory|Wiper|Seat Cover|Car Polish|Air Freshener|Car Charger|Dashboard Camera|Car Vacuum|Bike Cover|Car Mat|Engine Oil|Tool Kit|Spare Parts/)) 
    return 'Automotive and Accessories';

// Jewelry and Watches
if (lowerMsg.match(/jewelry|ring|bracelet|necklace|watch|earring|pendant|bangle|gold|silver|diamond|platinum|anklet|brooch|cufflink|chain|charm|gemstone|Jewelry|Ring|Bracelet|Necklace|Watch|Earring|Pendant|Bangle|Gold|Silver|Diamond|Platinum|Anklet|Brooch|Cufflink|Chain|Charm|Gemstone/)) 
    return 'Jewelry and Watches';

// Pet Supplies
if (lowerMsg.match(/pet|dog|cat|fish|bird|pet food|collar|leash|litter|aquarium|cage|pet bed|pet toy|dog house|scratching post|pet grooming|pet shampoo|pet bowl|Pet|Dog|Cat|Fish|Bird|Pet Food|Collar|Leash|Litter|Aquarium|Cage|Pet Bed|Pet Toy|Dog House|Scratching Post|Pet Grooming|Pet Shampoo|Pet Bowl/)) 
    return 'Pet Supplies';

// Industrial and Scientific
if (lowerMsg.match(/industrial|scientific|lab|equipment|tool|hardware|power tool|measuring|testing|safety|protective gear|adhesive|sealant|fastener|bearing|sensor|automation|Industrial|Scientific|Lab|Equipment|Tool|Hardware|Power Tool|Measuring|Testing|Safety|Protective Gear|Adhesive|Sealant|Fastener|Bearing|Sensor|Automation/)) 
    return 'Industrial and Scientific';

// Musical Instruments
if (lowerMsg.match(/guitar|piano|keyboard|drum|violin|flute|saxophone|microphone|amplifier|speaker|music stand|tuner|metronome|sheet music|dj equipment|recording|Guitar|Piano|Keyboard|Drum|Violin|Flute|Saxophone|Microphone|Amplifier|Speaker|Music Stand|Tuner|Metronome|Sheet Music|Dj Equipment|Recording/)) 
    return 'Musical Instruments';

// Office Supplies
if (lowerMsg.match(/office|desk|chair|printer|scanner|shredder|projector|whiteboard|notice board|file cabinet|stationery|organizer|office decor|office lighting|Office|Desk|Chair|Printer|Scanner|Shredder|Projector|Whiteboard|Notice Board|File Cabinet|Stationery|Organizer|Office Decor|Office Lighting/)) 
    return 'Office Supplies';

// Travel and Luggage
if (lowerMsg.match(/travel|luggage|suitcase|backpack|duffle bag|trolley|travel pillow|passport holder|travel adapter|travel organizer|travel bag|camping gear|Travel|Luggage|Suitcase|Backpack|Duffle Bag|Trolley|Travel Pillow|Passport Holder|Travel Adapter|Travel Organizer|Travel Bag|Camping Gear/)) 
    return 'Travel and Luggage';


    // Others
    return 'Others';
}


// ✅ Bot Status
console.log('🚀 Bot is now listening for posts from Ecommerce Website Group...');
