const express = require('express');
const cors = require('cors');
const aiRoutes = require('./src/aiRoutes'); // Уверете се, че пътят е правилен
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', aiRoutes); // Уверете се, че този ред е правилно конфигуриран

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
