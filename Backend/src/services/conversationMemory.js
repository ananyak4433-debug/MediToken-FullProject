const memory = new Map();

const getMemory = (userId) => {
    return memory.get(userId.toString()) || {};
};

const saveMemory = (userId, data) => {

    const oldMemory = getMemory(userId);

    memory.set(userId.toString(), {
        ...oldMemory,
        ...data
    });

};

const clearMemory = (userId) => {
    memory.delete(userId.toString());
};

module.exports = {
    getMemory,
    saveMemory,
    clearMemory
};