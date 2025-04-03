
module.exports = {
  data: {
    name: 'IN', // must match the case you check for
  },
  execute: async ({ lain, M, I, N, T, config }) => {
    // Your command logic here
    await lain.sendMessage(I, 
      { image: { url: '' }, 
      caption: `> null` }, 
      { quoted: M });
  }
};

