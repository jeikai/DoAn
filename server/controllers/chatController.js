const chatModel = require('../models/ChatGroup')

exports.create = async function (req, res) {
    try {
        const { chatName, listUser, listMessage } = req.body;
        console.log(req.body)
        if (!chatName || !listUser || !listMessage) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        const chatGroupData = {
            chatName,
            listUser,
            listMessage,
        };

        const chatGroupId = await chatModel.addChatGroup(chatGroupData);

        res.status(201).json({ chatGroupId });
    } catch (error) {
        console.error('Error in addChatGroup route: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};