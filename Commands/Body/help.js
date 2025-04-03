
module.exports = {
  data: {
    name: 'help' // must match the case you check for
  },
  execute: async ({ lain, M, I, N, T, config }) => {
    // Your command logic here
    await lain.sendMessage(I, 
      { image: { url: 'https://i.ibb.co/0yBkPr4y/uww-B7m-Yqr-Mk8fg-Jfa5nv-VIafu-WY.jpg' }, 
      caption: `> nulo` }, 
      { quoted: M });
  }
};
