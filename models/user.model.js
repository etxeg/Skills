const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Name is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

//userSchema.pre('save', async function (next) {
//    if (!this.isModified('password')) return next();
//    this.password = await bcrypt.hash(this.password, 10);
//    next();
//});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;