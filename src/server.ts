import express, { Request, Response } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 6969;

// Folder na obrazy
const IMAGES_DIR = path.join(__dirname, '../images');
if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR);
}

// Konfiguracja multer do przechwytywania przesyłanych plików
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint do uploadu obrazu
app.post('/upload', upload.single('image'), async (req: Request, res: Response) => {
    try {
        const imageBuffer = req.file?.buffer;
        if (!imageBuffer) {
            res.status(400).json({ error: 'No image provided' });
            return;
        }

        const hash = uuidv4();
        const imagePath = path.join(IMAGES_DIR, `${hash}.jpg`);

        await sharp(imageBuffer)
            .jpeg()
            .toFile(imagePath);

        res.json({ hash: hash });
    } catch (error) {
        res.status(500).json({ error: 'Failed to process image' });
    }
});

// Endpoint do pobierania obrazu
app.get('/get/:hash', (req: Request, res: Response) => {
    const hash = req.params.hash;
    const imagePath = path.join(IMAGES_DIR, `${hash}.jpg`);

    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        res.status(404).json({ error: 'Image not found' });
    }
});

// Endpoint do usuwania obrazu
app.delete('/remove/:hash', (req: Request, res: Response) => {
    const hash = req.params.hash;
    const imagePath = path.join(IMAGES_DIR, `${hash}.jpg`);

    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        res.json({ message: 'Image removed' });
    } else {
        res.status(404).json({ error: 'Image not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});