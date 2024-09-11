const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4001;

app.use(cors({
    origin: 'https://master--sparkling-beignet-eb7f32.netlify.app/',
    methods: ['GET'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.get('/', (req, res) => {
    const search = req.query.search;
    const page = parseInt(req.query.page) || 0;
    const perPage = parseInt(req.query.perPage) || 10; // Default to 10 if not specified
    const filePath = path.join(__dirname, 'data.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading the file' });
        }
        
        let data1 = JSON.parse(data);
        let filteredData = data1;

        // If search parameter is present, filter by country name
        if (search) {
            filteredData = data1.filter(item => item.name.toLowerCase() === search.toLowerCase());
        } else {
            // Filter by region if specified
            if (req.query.region) {
                filteredData = data1.filter(item => item.region === req.query.region);
            }
        }

        const totalCountries = filteredData.length; // Total number of filtered countries

        if (totalCountries === 0) {
            return res.status(404).json({ message: 'No such country found' });
        }

        // Pagination
        const start = page * perPage;
        const end = start + perPage;
        const result = filteredData.slice(start, end);

        res.status(200).json({
            countries: result,
            totalCountries: totalCountries
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
