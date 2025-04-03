
module.exports = {
  data: {
    name: 'command', // must match the case you check for
  },
  execute: async ({ lain, M, I, N, T, config }) => {
    // Your command logic here
    await lain.sendMessage(I, 
      { image: { url: 'https://i.ibb.co/hwj08JJ/892071-1920x1080-desktop-full-hd-serial-experiments-lain-background-photo.jpg' }, 
      caption: `> null` }, 
      { quoted: M });
  }
};