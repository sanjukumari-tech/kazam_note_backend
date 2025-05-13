import { createRedisClient } from "../config/redis.js";
import { Note } from "../models/Task.js";
const redis = createRedisClient();
const notes = [];
const REDIS_KEY= process.env.REDIS_KEY;
(async () => {
  try {
    const cachedNotes = await redis.get(REDIS_KEY);

    if (cachedNotes) {
      const parsedNotes = JSON.parse(cachedNotes);
      notes.push(...parsedNotes);
      console.log(`Loaded ${parsedNotes.length} notes from Redis`);
    } else {
      console.log("No notes in Redis cache → fetching from MongoDB...");
    }
  } catch (err) {
    console.error("Failed to load notes from storage:", err);
  }
})();

async function dataToRedisOrMongo(notes) {
  if (notes.length >= 50) {

    try {
      await Note.insertMany(notes);
      await redis.del(REDIS_KEY); 
      notes.length = 0; 
   
    } catch (err) {
      console.error("Error saving to MongoDB:", err);
    }
  } else {
    try {
      await redis.set(REDIS_KEY, JSON.stringify(notes));

    } catch (err) {
      console.error("Error saving to Redis:", err);
    }
  }
}


export const add = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({
        status: "error",
        message: "Text is required"
      });
    }
 
    const cached = await redis.get(REDIS_KEY);
    const notes = cached ? JSON.parse(cached) : [];
    const note = {text, createdAt: new Date() };
    notes.push(note);

    if (notes.length > 0) {
      await dataToRedisOrMongo(notes);
    }

    const io = req.app.locals.io;
    io.emit("new notes", note);
    console.log("Emitted new notes using socket.io",note.text);

    return res.status(201).json({
      status: "success",
      message: "Note added successfully",
      notesCount: notes.length,
      notes
    });
  } catch (error) {
    console.error("Add Note Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while adding the note",
      error: error?.message
    });
  }
};


export const fetchAllNotes = async (req, res) => {
  try {
    const cached = await redis.get(REDIS_KEY);
    const notes = cached ? JSON.parse(cached) : [];

    res.json({ notes });
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ status: "error", message: "Failed to fetch notes" });
  }
};
