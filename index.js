const config = require('./config.json');
const fs = require("fs");
const path = require("path");
const P = "/"; // Prefixo de comando

const { makeWASocket, Browsers, DisconnectReason, useMultiFileAuthState
} = require("@whiskeysockets/baileys");
 
const commands = new Map();
const foldersPath = path.join(__dirname, 'Commands');
const commandFolders = fs.readdirSync(foldersPath);


for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
     const filePath = path.join(commandsPath, file);
     const command = require(filePath);
    if ('data' in command && 'execute' in command) {
     commands.set(command.data.name, command);
    }   
    else {
     console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

let Text = "";

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


  // Body//
  lain.ev.on("messages.upsert", async (x) => {
    try {
      const M = x.messages[0];
      if (!M.message) return;
 
      const I = M.key.remoteJid;
      const N = M.pushName;
      const T = M.message?.extendedTextMessage?.text || M.message?.conversation || "";
      
      if (!T.startsWith(P)) return;
  
      const C = T.slice(1).toLowerCase(); 
      

      switch (C) {

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
          // Check if it's a registered command
          if (commands.has(C)) {
            const command = commands.get(C);
            try {
              await command.execute({ lain, M, I, N, T, config, });
              return;
            } catch (error) {
              console.error(`Error executing command ${C}:`, error);
              Text = "❌ Ocorreu um erro ao executar o comando.";
            }
          } else {
            return; // Unknown command, do nothing
          }
      } //end Switch
      
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  // Atualização do grupo (boas-vindas)
  lain.ev.on("group-participants.update", async (x) => {
    try {
      const { id, participants, action } = x;
      console.log("Grupo-Infos:", x);

      // Verifica se o grupo está na lista de permitidos
      if (!config.allowedGroups.includes(id)) return;

      if (action === "add") {
        for (let participant of participants) {
          let number = participant.replace("@s.whatsapp.net", "");

          let D;
          try {
            const I = await lain.profilePictureUrl(id, 'image');
            const M = await lain.groupMetadata(id);
            D = M.desc || "Este grupo não tem uma descrição.";
          } catch (e) {
            console.log("Erro ao obter a descrição do grupo:", e);
            D = "Não foi possível carregar a descrição.";
          }

          Text = `Bem-vindo *@${number}*, ao $! 🎉\n\n📌 *:* ${D}`;
          
          console.log(M);
          await lain.sendMessage(id, { 
            image: { url: I },
            caption: Text,
            mentions: [participant] 
          });
        }
      }
    } catch (e) {
      console.error("Error in group update handler:", e);
    }
  });
}

Y().catch(console.error);