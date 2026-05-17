import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config(); 

const app = express();
const prisma = new PrismaClient();

app.use(cors()); 
app.use(express.json({ limit: '10mb' })); 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadToCloudinary(base64Image: string): Promise<string> {
  if (!base64Image.startsWith('data:image')) return base64Image;

  try {
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: 'berceni_chronicles_stories', 
    });
    return uploadResponse.secure_url;
  } catch (error) {
    console.error("Eroare la upload-ul în Cloudinary:", error);
    return '';
  }
}

app.get('/api/stories', async (req, res) => {
  try {
    const stories = await prisma.userStory.findMany({ orderBy: { createdAt: 'desc' } });
    const formattedStories = stories.map(s => ({
      ...s,
      funFacts: JSON.parse(s.funFacts),
      createdAt: new Date(s.createdAt).getTime()
    }));
    res.json(formattedStories);
  } catch (error) {
    res.status(500).json({ error: "Eroare la preluarea poveștilor" });
  }
});

app.post('/api/stories', async (req, res) => {
  try {
    const { id, name, story, image, lat, lng, funFacts } = req.body;
    
    const finalImageUrl = image ? await uploadToCloudinary(image) : null;

    const newStory = await prisma.userStory.create({
      data: { 
        id, 
        name, 
        story, 
        image: finalImageUrl,
        lat, 
        lng, 
        funFacts: JSON.stringify(funFacts || []) 
      }
    });
    res.json({ ...newStory, funFacts: JSON.parse(newStory.funFacts || '[]'), createdAt: new Date(newStory.createdAt).getTime() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Eroare la crearea poveștii" });
  }
});

app.put('/api/stories/:id', async (req, res) => {
  try {
    const { name, story, image, lat, lng, funFacts } = req.body;
    
    const finalImageUrl = image ? await uploadToCloudinary(image) : null;

    const updated = await prisma.userStory.update({
      where: { id: req.params.id },
      data: { name, story, image: finalImageUrl, lat, lng, funFacts: JSON.stringify(funFacts || []) }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Eroare la actualizare" });
  }
});

app.delete('/api/stories/:id', async (req, res) => {
  try {
    await prisma.userStory.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Eroare la ștergere" });
  }
});

app.get('/api/quest/:userId', async (req, res) => {
  try {
    const progress = await prisma.questProgress.findUnique({ where: { userId: req.params.userId } });
    if (progress) {
      res.json({ started: progress.started, tasks: JSON.parse(progress.tasks) });
    } else {
      res.json(null);
    }
  } catch (error) {
    res.status(500).json({ error: "Eroare" });
  }
});

app.post('/api/quest/:userId', async (req, res) => {
  try {
    const { started, tasks } = req.body;
    const progress = await prisma.questProgress.upsert({
      where: { userId: req.params.userId },
      update: { started, tasks: JSON.stringify(tasks) },
      create: { userId: req.params.userId, started, tasks: JSON.stringify(tasks) }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Eroare la salvare progres" });
  }
});

app.post('/api/feedback', async (req, res) => {
  try {
    const { userId, grade, suggestion } = req.body;
    await prisma.feedback.create({ data: { userId, grade, suggestion } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Eroare la trimitere feedback" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serverul rulează pe portul ${PORT}`));