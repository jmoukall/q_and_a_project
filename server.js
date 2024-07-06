const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const path = require('path');

const app = express();
const upload = multer({ storage }); // Ensure the directory exists and is writable

let questions = [];

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'))); // Serve uploaded files

app.get('/api/questions', (req, res) => {
    console.log('Sending questions:', questions); // Log questions
    res.json(questions);
});

app.post('/api/questions', upload.single('media'), (req, res) => {
    const { name, question } = req.body;
    const file = req.file;

    if (name && question) {
        const newQuestion = { name, question };
        if (file) {
            newQuestion.media = `/uploads/${file.filename}`;
        }
        questions.push(newQuestion);
        console.log('Added question:', newQuestion); // Log added question
        res.status(201).json({ message: 'Question added' });
    } else {
        res.status(400).json({ message: 'Invalid input' });
    }
});

// Define your API endpoint
app.get('/api/secret', (req, res) => {
    // Respond with the index.html content
    res.sendFile(__dirname + '/public/index_1.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
