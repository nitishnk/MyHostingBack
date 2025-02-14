const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
},
);

// CategorySchema.index({ name: 1 }, { unique: true }); // Ensure unique index on name

module.exports = mongoose.model('Category', CategorySchema);