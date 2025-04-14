// Import Required Packages
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Allow cross-origin requests

// Create Express App
const app = express();
const PORT = 3000;

// Middleware to Parse JSON Requests
app.use(express.json());
app.use(cors()); // Enable CORS

// Serve Static Files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ API Endpoint to Get Offers (Auto-Clean Expired Offers Before Sending)
app.get('/api/get-offers', (req, res) => {
    const offersFilePath = path.join(__dirname, 'offers.json');

    // Remove expired offers first
    removeExpiredOffers();

    // Read offers.json to get all saved offers
    fs.readFile(offersFilePath, (err, data) => {
        if (err) {
            console.error('❌ Error reading offers.json:', err.message);
            return res.status(500).json({ error: 'Failed to load offers' });
        }

        // Parse and return the offers
        const offers = JSON.parse(data || '[]');
        res.json(offers);
    });
});

// ✅ API Endpoint to Save Offers
app.post('/api/save-offer', (req, res) => {
    const offerData = req.body;
    const offersFilePath = path.join(__dirname, 'offers.json');

    // Add expiryTime (24 hours from now)
    offerData.expiryTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    // Read existing offers or create an empty array if file not found
    fs.readFile(offersFilePath, (err, data) => {
        let offers = [];
        if (!err && data.length > 0) {
            offers = JSON.parse(data);
        }

        // Add new offer to the offers list
        offers.push(offerData);

        // Save updated offers to offers.json
        fs.writeFile(offersFilePath, JSON.stringify(offers, null, 2), (err) => {
            if (err) {
                console.error('❌ Error saving offer:', err.message);
                return res.status(500).json({ error: 'Failed to save offer' });
            }
            console.log('✅ Offer saved successfully!');
            res.json({ message: 'Offer saved successfully!' });
        });
    });
});

// ✅ Function to Remove Expired Offers
function removeExpiredOffers() {
    const offersFilePath = path.join(__dirname, 'offers.json');

    fs.readFile(offersFilePath, (err, data) => {
        if (err || !data.length) return;

        let offers = JSON.parse(data);
        const currentTime = Date.now();

        // Filter out expired offers
        offers = offers.filter((offer) => offer.expiryTime > currentTime);

        // Update offers.json with valid offers only
        fs.writeFile(offersFilePath, JSON.stringify(offers, null, 2), (err) => {
            if (err) {
                console.error('❌ Error removing expired offers:', err.message);
            } else {
                console.log('♻️ Expired offers removed successfully!');
            }
        });
    });
}

// ✅ Route for Homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Create offers.json if not present
const offersFilePath = path.join(__dirname, 'offers.json');
if (!fs.existsSync(offersFilePath)) {
    fs.writeFileSync(offersFilePath, '[]'); // Initialize with empty array
    console.log('✅ offers.json created successfully!');
}

// Run cleanup every 1 hour to remove expired offers
setInterval(removeExpiredOffers, 60 * 60 * 1000); // 1 hour interval

// Start the Server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
