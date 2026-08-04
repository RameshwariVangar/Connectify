import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    // 👥 Participants: Isme dono users ki unique IDs ka array hoga
    // Isse pata chalega ki yeh dabba kin do logo ka hai
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ],

    // 💬 Messages: Isme dono ke saare messages line-by-line ek hi array mein save honge
    messages: [
        {
            senderId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            messageText: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);

export default Chat ;