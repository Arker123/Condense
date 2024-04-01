const User = require("../models/UserModel");

const getAllNotes = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res
                .status(400)
                .json({ success: false, message: "User Id is required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "User not found" });
        }

        const notes = user.notes;

        res.status(200).json({ success: true, notes });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

const getNote = async (req, res) => {
    try {
        const { userId, videoId } = req.body;
        if (!userId || !videoId) {
            return res.status(400).json({
                success: false,
                message: "User Id and Video Id are required",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "User not found" });
        }

        const noteIndex = user.notes.findIndex(
            (note) => note.videoId === videoId,
        );

        if (noteIndex === -1) {
            res.status(400).json({ success: false, message: "Note not found" });
        }

        const reqNote = user.notes[noteIndex];

        res.status(200).json({ success: true, reqNote });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

const modifyNote = async (req, res) => {
    try {
        const { userId, videoId, note } = req.body;
        if (!userId || !videoId || !note) {
            return res.status(400).json({
                success: false,
                message: "User Id, Video Id and note are required",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "User not found" });
        }

        const noteIndex = user.notes.findIndex(
            (note) => note.videoId === videoId,
        );

        if (noteIndex === -1) {
            return res
                .status(400)
                .json({ success: false, message: "Note not found" });
        }

        for (const [key, value] of Object.entries(note)) {
            if (user.notes[noteIndex]) {
                user.notes[noteIndex][key] = value;
            }
        }
        await user.save();

        res.status(200).json({
            success: true,
            message: "Note updated successfully",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const createNote = async (req, res) => {
    try {
        console.log("in create note");
        const { userId, videoId, note } = req.body;
        if (!userId || !note || !note.body) {
            return res.status(400).json({
                success: false,
                message: "User Id, video Id and note body cannot be empty",
            });
        }
        console.log("creating new note ob");
        const newNote = { ...note, videoId };

        console.log("finding user");
        const user = await User.findById(userId);
        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "User not found" });
        }

        console.log("adding into database");
        user.notes.push(newNote);

        await user.save();

        console.log("final step");
        res.status(200).json({
            success: true,
            message: "Note created successfully",
            newNote,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteNote = async (req, res) => {
    try {
        const { userId, videoId } = req.body;
        if (!userId || !videoId) {
            return res.status(400).json({
                success: false,
                message: "User Id and Video Id are required",
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "User not found" });
        }

        await User.findByIdAndUpdate(userId, {
            $pull: {
                notes: { videoId: videoId },
            },
        });

        res.status(200).json({
            success: true,
            message: "Note deleted successfully",
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

module.exports = { getAllNotes, getNote, modifyNote, createNote, deleteNote };
