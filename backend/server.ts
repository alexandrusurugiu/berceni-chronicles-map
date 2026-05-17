import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const app = express();
const prisma = new PrismaClient();

app.use(cors()); 
app.use(express.json({ limit: '10mb' })); 

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use('/uploads', express.static(uploadDir));

function saveImageLocally(base64Image: string): string {
  if (!base64Image.startsWith('data:image')) return base64Image;

  const matches = base64Image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) return base64Image;

  const extension = matches[1] === 'jpeg' ? 'jpg' : matches[1]; 
  const base64Data = matches[2] as string;
  
  const fileName = `story_${Date.now()}_${Math.floor(Math.random() * 1000)}.${extension}`;
  const filePath = path.join(uploadDir, fileName);

  fs.writeFileSync(filePath, base64Data, 'base64');
  
  return `http://localhost:3000/uploads/${fileName}`;
}

app.get('/api/stories', async (req, res) => {
  const stories = await prisma.userStory.findMany({ orderBy: { createdAt: 'desc' } });
  const formattedStories = stories.map(s => ({
    ...s,
    funFacts: JSON.parse(s.funFacts),
    createdAt: new Date(s.createdAt).getTime()
  }));
  res.json(formattedStories);
});

app.post('/api/stories', async (req, res) => {
  const { id, name, story, image, lat, lng, funFacts } = req.body;
  
  const finalImageUrl = image ? saveImageLocally(image) : null;

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
  res.json({ ...newStory, funFacts: JSON.parse(newStory.funFacts), createdAt: new Date(newStory.createdAt).getTime() });
});

app.put('/api/stories/:id', async (req, res) => {
  const { name, story, image, lat, lng, funFacts } = req.body;
  
  const finalImageUrl = image ? saveImageLocally(image) : null;

  const updated = await prisma.userStory.update({
    where: { id: req.params.id },
    data: { name, story, image: finalImageUrl, lat, lng, funFacts: JSON.stringify(funFacts || []) }
  });
  res.json(updated);
});

app.delete('/api/stories/:id', async (req, res) => {
  await prisma.userStory.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

app.get('/api/quest/:userId', async (req, res) => {
  const progress = await prisma.questProgress.findUnique({ where: { userId: req.params.userId } });
  if (progress) {
    res.json({ started: progress.started, tasks: JSON.parse(progress.tasks) });
  } else {
    res.json(null);
  }
});

app.post('/api/quest/:userId', async (req, res) => {
  const { started, tasks } = req.body;
  const progress = await prisma.questProgress.upsert({
    where: { userId: req.params.userId },
    update: { started, tasks: JSON.stringify(tasks) },
    create: { userId: req.params.userId, started, tasks: JSON.stringify(tasks) }
  });
  res.json({ success: true });
});

app.post('/api/feedback', async (req, res) => {
  const { userId, grade, suggestion } = req.body;
  await prisma.feedback.create({ data: { userId, grade, suggestion } });
  res.json({ success: true });
});

app.listen(3000, () => console.log('Serverul rulează pe http://localhost:3000'));