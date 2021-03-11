// I am a web page!
// Or at least a node thing that wants data from another API

const axios = require('axios');

async function getUser() {
  try {
    console.log('Consumer APP: I\'m going to make a call to the provider API');
    const response = await axios.get('http://localhost:8888/things');
    return response;
  } catch (error) {
    console.error('Consumer APP: oh-oh, something broke. ', error);
    throw error;
  }
}

module.exports = { getUser };
