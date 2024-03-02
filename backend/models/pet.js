const mongoose = require('../db/conn')
const {Schema} = mongoose

const pet = mongoose.model(
    'pet',
    new Schema({
        name: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true
        },
        weight: {
            type: Number,
            required: true
        },
        images: {
            type: Array,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        available: {
            type: Boolean
        },
        user: Object,
        adopter: Object,
    },
    {timestamps: true}, 
    )
)