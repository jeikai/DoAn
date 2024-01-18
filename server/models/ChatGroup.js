const admin = require('firebase-admin');
const db = admin.firestore();

const chatGroupCollection = db.collection('chatgroups');

const ChatGroupSchema = {
  chatName: { type: String, required: true },
  listUser: [],
  listMessage: [],
  date_created: admin.firestore.FieldValue.serverTimestamp()
};

const addChatGroup = async (chatGroupData) => {
  try {
    const docRef = await chatGroupCollection.add(chatGroupData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding ChatGroup: ', error);
    throw error;
  }
};

module.exports = {
  addChatGroup,
};
