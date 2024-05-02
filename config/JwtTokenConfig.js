const { createHash }= require("crypto");

function sha256hash(content) {  
    return createHash('sha3-256').update(Object.values(content).toString()).digest('hex');
  }

module.exports = sha256hash;