const { P, MImg } require('config.ts');

const { makeWASocket, DisconnectReason, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const fs = require("fs");


async function Main() {
  const { state, saveCreds } = await useMultiFileAuthState("lib/baileys/auth_info_baileys");

  const lain = makeWASocket({
    printQRInTerminal: true,
    auth: state,
  });

  lain.ev.on("creds.update", saveCreds);

  //Connect the function comes 	U = Update//
  lain.ev.on("connection.update", (U) => {
    const { connection, lastDisconnect } = U;
    if (connection === "close") {
      const shouldReconnect =
        (lastDisconnect.error)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      console.log(
        "connection closed due to ",
        lastDisconnect.error,
        ", reconnecting ",
        shouldReconnect
      );
      // reconnect if not logged out
      if (shouldReconnect) {
        connectToWhatsApp();
      }
    } else if (connection === "open") {
      console.log("opened connection");
    }
  });

  //Message	//
  lain.ev.on("messages.upsert", async (m) => {
    //Definiçoes inicais
    const M = m.messages[0];
    const I = M.key.remoteJid; 
    const N = M.pushName;
    const T = M.message.extendedTextMessage.text? || M.message.conversation;


    const F = T.startsWith(P);
    const C = F.toLowerCase();

    switch (C) {

      case 'menu':
        var MText = `> Lain Bem-Vindo ${N} 

       /Main
       /SubCommand
       /Config
       /Help
       
       #Fui Criado Por Naylor-C`;

        await lain.sendMessage(I,
          {
            image: {
              url: {
                Imglain
              },
              caption: MText,
            }
          }, { quoted: M });
        break;

      case 'main':
        MText = `lainbida`;
        await lain.sendMessage(I,
          {
            image: {
              url: {
                Imglain
              },
              caption: MText,
            }
          }, { quoted: M });
        break;

      case 'subcommand:
        MText = `lainbida`;
        await lain.sendMessage(I,
          {
            image: {
              url: {
                Imglain
              },
              caption: MText,
            }
          }, { quoted: M });
        break;
 
      case 'config':
        MText = `lainbida`;
        await lain.sendMessage(I,
          {
            image: {
              url: {
                Imglain
              },
              caption: MText,
            }
          }, { quoted: M });
        break;


      case 'help':
        MText = `lainbida`;
        await lain.sendMessage(I,
          {
            image: {
              url: {
                Imglain
              },
              caption: MText,
            }
          }, { quoted: M });
        break;


    }

   console.log(JSON.stringify(m, undefined, 2));
  });
}

Main();
