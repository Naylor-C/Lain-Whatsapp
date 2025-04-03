
module.exports = {
  data: {
    name: 'menu' // must match the case you check for
  },

  execute: async ({ lain, M, I, N, T, config, }) => {
    await lain.sendMessage(I,
      { image:
        { url: 'https://i.ibb.co/mrXxJJMW/lain2bgpl0.jpg'},
       caption:`> Bem-Vindo ${N}\n\n/Lain\n/Command\n/Config\n/Help\n\n> #Fui Criado Por: https://naylor-c.github.io/Naylor-C/`},
      { quoted: M });
  }
};