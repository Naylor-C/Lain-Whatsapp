
const config = require('./config.json');
const fs = require("fs");
const path = require("path");
const P = "/"; // Prefixo de comando

const { makeWASocket, 
Browsers, DisconnectReason, useMultiFileAuthState
} = require("@whiskeysockets/baileys");

const Img = "https://i.ibb.co/mrXxJJMW/lain2bgpl0.jpg";
const Lain = "https://naylor-c.github.io/Lain/"; 
const Naylor = "https://naylor-c.github.io/Naylor-C/";

async function Y () {
  const { state, saveCreds } = await useMultiFileAuthState("lib/baileys/auth_info_baileys");

  const lain = makeWASocket({
    browser: Browsers.ubuntu('My App'),
    printQRInTerminal: true,
    auth: state,
  });

  lain.ev.on("creds.update", saveCreds);

  lain.ev.on("connection.update", (x) => {
    const { connection, lastDisconnect } = x;
    if (connection === "close") {
      const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("connection closed due to ", lastDisconnect.error, ", reconnecting ", shouldReconnect);
      if (shouldReconnect) {
        Y();
      }
    } else if (connection === "open") {
      console.log("opened connection");
    }
  });

  lain.ev.on("messages.upsert", async (x) => {
    try {
      const M = x.messages[0];
      if (!M.message) return;

      const I = M.key.remoteJid;
      const N = M.pushName;
      const T = M.message?.extendedTextMessage?.text || M.message?.conversation || "";
      
      if (!T.startsWith(P)) return;

      const C = T.slice(1).toLowerCase(); 
      let Text = "";

      switch (C) {

        case 'menu':
          Text = `> Bem-Vindo ${N}\n> /Lain: ${Lain}\n\n/Command\n/Config\n/Help\n\n> #Fui Criado Por ${Naylor}:`;
          break;
          
        case 'Lain':
          Text = `/Naylor-Institute | /IN\n/Eletroc`;
          break;

        case 'command':
          Text = `> Command Function:\n/Download`;
          break;

        case 'config':
          Text = `> Main function:\n/Ban\n/Unban\n/Demote\n/Promote`; 
          break;

        case 'help':
          Text = ``;
          break;

         case 'download':
          Text = ``
          break
        case 'bem-vindo':
          // Verifica se é um grupo
          if (!I.endsWith('@g.us')) {
            Text = "Este comando só pode ser usado em grupos!";
          } else {
            if (!config.allowedGroups.includes(I)) {
              config.allowedGroups.push(I);
              fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
              Text = "✅ Grupo adicionado à lista de permitidos!";
            } else {
              Text = "ℹ️ Este grupo já está na lista de permitidos.";
            }
          }
          break;



        default:
          return;
      }

      await lain.sendMessage(I, 
        { 
          image: { 
            url: Img 
          }, 
          caption: Text,  
        }, { quoted: M });
      
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  // Atualização do grupo (boas-vindas)
  lain.ev.on("group-participants.update", async (x) => {
    try {
      const { id, participants, action } = x;
      console.log("ID do grupo:", id);

      // Verifica se o grupo está na lista de permitidos
      if (!config.allowedGroups.includes(id)) return;

      if (action === "add") {
        for (let participant of participants) {
          let number = participant.replace("@s.whatsapp.net", "");

          let groupDescription;
          try {
            const groupMetadata = await lain.groupMetadata(id);
            groupDescription = groupMetadata.desc || "Este grupo não tem uma descrição.";
          } catch (error) {
            console.log("Erro ao obter a descrição do grupo:", error);
            groupDescription = "Não foi possível carregar a descrição.";
          }

          const welcomeMessage = `👋 Olá *@${number}*, bem-vindo(a) ao grupo! 🎉\n\n📌 *:* ${groupDescription}`;
          
          await lain.sendMessage(id, { 
            text: welcomeMessage, 
            mentions: [participant] 
          });
        }
      }
    } catch (error) {
      console.error("Error in group update handler:", error);
    }
  });
}

Y().catch(console.error);