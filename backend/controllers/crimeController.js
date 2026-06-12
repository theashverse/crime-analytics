const Crime = require("../models/crime");

// Get crimes with filters
exports.getCrimes = async (req, res) => {
    try {
        const { state, year, crime_type } = req.query;
        let filter = {};
        if (state) filter.state = state;
        if (year) filter.year = Number(year);
        if (crime_type) filter.crime_type = crime_type;
        const crimes = await Crime.find(filter).limit(2000);
        res.json(crimes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get summary stats
exports.getSummary = async (req, res) => {
    try {
        // Top state
        const topStateResult = await Crime.aggregate([
            { $group: { _id: "$state", total: { $sum: "$total_cases" } } },
            { $sort: { total: -1 } },
            { $limit: 1 }
        ]);

        // Peak year
        const peakYearResult = await Crime.aggregate([
            { $group: { _id: "$year", total: { $sum: "$total_cases" } } },
            { $sort: { total: -1 } },
            { $limit: 1 }
        ]);

        // Total crimes
        const totalResult = await Crime.aggregate([
            { $group: { _id: null, total: { $sum: "$total_cases" } } }
        ]);

        res.json({
            topState: topStateResult[0]?._id || "N/A",
            peakYear: peakYearResult[0]?._id || "N/A",
            totalCrimes: totalResult[0]?.total || 0,
            crimeTypes: 6
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all states
exports.getStates = async (req, res) => {
    try {
        const states = await Crime.distinct("state");
        res.json(states.sort());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all crime types
exports.getCrimeTypes = async (req, res) => {
    try {
        const types = await Crime.distinct("crime_type");
        res.json(types.sort());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get trends by year
exports.getTrends = async (req, res) => {
    try {
        const { state, crime_type } = req.query;
        let match = {};
        if (state) match.state = state;
        if (crime_type) match.crime_type = crime_type;

        const trends = await Crime.aggregate([
            { $match: match },
            { $group: { _id: "$year", total: { $sum: "$total_cases" } } },
            { $sort: { _id: 1 } }
        ]);
        res.json(trends);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get years
exports.getYears = async (req, res) => {
    try {
        const years = await Crime.distinct("year");
        res.json(years.sort());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTopStates = async (req, res) => {
    try {
        const { crime_type, year } = req.query;
        let match = {};
        if (crime_type) match.crime_type = crime_type;
        if (year) match.year = Number(year);

        const result = await Crime.aggregate([
            { $match: match },
            { $group: { _id: '$state', total: { $sum: '$total_cases' } } },
            { $sort: { total: -1 } },
            { $limit: 10 }
        ]);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCrimeTypeStats = async (req, res) => {
    try {
        const { state, year } = req.query;
        let match = {};
        if (state) match.state = state;
        if (year) match.year = Number(year);

        const result = await Crime.aggregate([
            { $match: match },
            { $group: { _id: '$crime_type', total: { $sum: '$total_cases' } } },
            { $sort: { total: -1 } }
        ]);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};