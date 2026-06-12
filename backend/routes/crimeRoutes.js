const express = require("express");
const router = express.Router();

const {
    getCrimes, getSummary, getStates,
    getCrimeTypes, getTrends, getYears,
    getTopStates, getCrimeTypeStats
} = require("../controllers/crimeController");

router.get("/top-states", getTopStates);
router.get("/crime-stats", getCrimeTypeStats);

const { chat, getPolicy } = require('../controllers/chatController');

router.get("/crimes", getCrimes);
router.get("/summary", getSummary);
router.get("/states", getStates);
router.get("/crime-types", getCrimeTypes);
router.get("/trends", getTrends);
router.get("/years", getYears);
router.post('/chat', chat);
router.get('/policy', getPolicy);

module.exports = router;