import { createRedisClient } from "../config/redis.js";
import { Note } from "../models/Task.js";
const redis = createRedisClient();
const notes = [];

(async () => {
  try {
    const cachedNotes = await redis.get("FULLSTACK_TASK_SANJUKUMARI");
    if (cachedNotes) {
      const parsedNotes = JSON.parse(cachedNotes);
      notes.push(...parsedNotes);
      console.log(`Loaded ${parsedNotes.length} notes from Redis`);
    } else {
      console.log("No notes in Redis cache → fetching from MongoDB...");

      // Fetch from MongoDB
      const dbNotes = await Note.find().lean();
      if (dbNotes.length > 0) {
        notes.push(...dbNotes);
        console.log(`Loaded ${dbNotes.length} notes from MongoDB`);
      } else {
        console.log("No notes in MongoDB either");
      }
    }
  } catch (err) {
    console.error("Failed to load notes from storage:", err);
  }
})();

async function dataToRedis(notes) {
  if (notes.length <= 50) {
    await redis.set("FULLSTACK_TASK_SANJUKUMARI", JSON.stringify(notes));
  } else {
    console.log("Saving notes to MongoDB...");
    try {
      await Note.insertMany(notes);
      const dbNotes = await Note.find().lean();
      // console.log("dataFromMongodb",dbNotes)
      // console.log("Notes saved to MongoDB");
    } catch (err) {
      console.error(" Error saving to MongoDB:", err);
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

    const note = { text, createdAt: new Date() };
    notes.push(note);

    if (notes.length > 0) {
      await dataToRedis(notes);
    }

    const io = req.app.locals.io;
    io.emit("new notes", note);
    console.log("Emitted new notes using socket.io");

    return res.status(201).json({
      status: res.status,
      message: "Note added successfully",
      notesCount: notes.length,
      note
    });
  } catch (error) {
    console.error("Add Note Error:", error);
    return res.status(500).json({
      status: res.status,
      message: "Something went wrong while adding the note",
      error: error?.message
    });
  }
};


export const fetchAllNotes = async (req, res) => {
  res.json({ notes });
};
