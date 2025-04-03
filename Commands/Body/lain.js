
module.exports = {
  data: {
    name: 'lain' // must match the case you check for
  },
  execute: async ({ lain, M, I, N, T, config }) => {
    // Your command logic here
    await lain.sendMessage(I, 
      { image: { url: 'https://i.ibb.co/rGqt7rTf/Serial-Experiments-Lain.webp' }, 
      caption: `> Serviços Unicos Da Lain:\n\n/Naylor-Institute || /IN\n/EletronicNaylor || /EN` }, 
      { quoted: M });
  }
};



       