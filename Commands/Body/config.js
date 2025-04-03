
module.exports = {
  data: {
    name: 'config' // must match the case you check for
  },
  execute: async ({ lain, M, I, N, T, config }) => {
    // Your command logic here
    await lain.sendMessage(I, 
      { image: { url: 'https://i.ibb.co/bgzNm91k/website-screenshot-eng-tutorial-q8up.png'}, 
      caption: `> Main function:\n/Ban\n/Unban\n/Demote\n/Promote` }, 
      { quoted: M });
  }
};
