const Discord = require('discord.js');
const bot = new Discord.Client();
//const { prefix , token } = require ('./config.json');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync');
const { isNull, isUndefined, random, find } = require('lodash');
const { ALL } = require('dns');
// db 
const dbdb = new FileSync("db.json")
const db = low(dbdb)
db.defaults({Coins: []}).write()
// db level
const dbdblevel = new FileSync("dblevel.json")
const dblevel = low(dbdblevel)
dblevel.defaults({Infos_membres: []}).write()



bot.on('ready', function () {
  console.log("Je suis prêt à être utilisé.")
  i=0
  const activity = [
    "Coin's shop | !piece",
    "Dev par Fenixor#9999"
  ]

  setInterval(() =>{
    bot.user.setActivity(activity[i]).catch(console.error)	
    i++
    if (i > 1){
      i = 0
    }
  }, 5000)
  
});


bot.on("guildCreate", guild => {
    
  if(guild.id !== "") return guild.leave()
})




bot.on("message", async message => {

  const msgauthorid = message.author.id
  const avatarembed = message.author.displayAvatarURL({size: 1024})

  if(!dblevel.get("Infos_membres").find({id : msgauthorid}).value()){
    dblevel.get("Infos_membres").push({id : msgauthorid, xp: 1, niveau : 1, xp_p_niveau : 75}).write()
    console.log(`${message.author.username} à envoyé son premier message !`)
}else {
    let userxpdb = dblevel.get("Infos_membres").filter({id : msgauthorid}).find("xp").value()
    let userxp = Object.values(userxpdb)
    let userniveaudb = dblevel.get("Infos_membres").filter({id : msgauthorid}).find("niveau").value()
    let userniveau = Object.values(userniveaudb)
    let userpniveaudb = dblevel.get("Infos_membres").filter({id : msgauthorid}).find("xp_p_niveau").value()
    let userpniveau = Object.values(userpniveaudb)

    let chiffre = [1, 2, 3, 4]
    let index = Math.floor(Math.random() * (chiffre.length - 1) + 1)

    dblevel.get("Infos_membres").find({id : msgauthorid}).assign({id : msgauthorid, xp : userxp[1] += chiffre[index]}).write()
    

    if (userxp[1] >= userpniveau[3] && msgauthorid != "782167090454200320"){
        if (msgauthorid != "782167090454200320"){
        dblevel.get("Infos_membres").find({id : msgauthorid}).assign({id : msgauthorid, xp : userxp[1] = 1}).write()
        dblevel.get("Infos_membres").find({id : msgauthorid}).assign({id : msgauthorid, niveau : userniveau[2] += 1}).write()
        dblevel.get("Infos_membres").find({id : msgauthorid}).assign({id : msgauthorid, xp_p_niveau : userpniveau[3] += 25}).write()

        if(db.get("Coins").find({id : msgauthorid}).value()){
          let coinsdb = db.get("Coins").filter({id : msgauthorid}).find("coins").value()
          let coinsvar = Object.values(coinsdb)
          const coinsadd = parseInt(1)
          const res = coinsadd + parseInt(coinsvar[1])
          db.get("Coins").find({id : msgauthorid}).assign({coins : res}).write()
        }else{
          db.get("Coins").push({id : msgauthorid, coins : 1}).write()
        }

        const embedann = new Discord.MessageEmbed()
        .setColor('#0099ff')
        //.setTitle(`Level de ${message.author.username}`)
        .setDescription(`Bravo **${message.author.username}** 🎉! Tu as gagné 1 :coin: !`)
        .setThumbnail(avatarembed)
        //.setImage('')
        .setTimestamp()
          .setFooter(message.author.username);
          message.channel.send(embedann);

    }}
}

  if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;



  function getUserFromMention(mention) {
    if (!mention) return;
  
    if (mention.startsWith('<@') && mention.endsWith('>')) {
      mention = mention.slice(2, -1);
  
      if (mention.startsWith('!')) {
        mention = mention.slice(1);
      }
  
      return bot.users.cache.get(mention);
    }
  }


  if(message.content === "!help"){
    if (message.member.roles.cache.some(role => role.name === 'Coins')) {
    const help = new Discord.MessageEmbed()
    .setColor(`RANDOM`)
    .setTitle(`Commandes disponibles`)
    .setDescription("**Commandes admin** :\n !refresh `Actualise le channel Membre`\n !add-coins @mention <nombre> `Ajoute des pièces à un membre`\n !del-coins @mention <nombre> `Eleve des pièces à un membre`\n\n**Commandes membres :**\n !coins (@mention) `Affiche le nombre de coins que vous avez ou celles d'un membre`\n !level `Affiche votre niveau`")
    .setThumbnail(avatarembed)
    //.setImage('')
    .setTimestamp()
      .setFooter(message.author.username);
      message.channel.send(help);
    }else{
    const help = new Discord.MessageEmbed()
    .setColor(`RANDOM`)
    .setTitle(`Commandes disponibles`)
    .setDescription("**Commandes membres :**\n !coins (@mention) `Affiche le nombre de coins que vous avez ou celles d'un membre`\n !level `Affiche votre niveau`")
    .setThumbnail(avatarembed)
    //.setImage('')
    .setTimestamp()
      .setFooter(message.author.username);
      message.channel.send(help);
    }
  }

    const commande = "!add-piece "

  if (message.content.startsWith(commande)) {
    if (message.member.roles.cache.some(role => role.name === 'Coins')) {
      const str = message.content.substring(commande.length).trim().split(/ +/);
      const mentionvar = getUserFromMention(str[0]).id

      if(db.get("Coins").find({id : mentionvar}).value()){
        if(!db.get("Coins").find({id : mentionvar , coins : 0}).value()){
        let coinsdb = db.get("Coins").filter({id : mentionvar}).find("coins").value()
        let coinsvar = Object.values(coinsdb)
        const res = parseInt(str[1]) + parseInt(coinsvar[1])
        db.get("Coins").find({id : mentionvar}).assign({coins : res}).write(),
        message.channel.send(`${str[1]} :coin: pièces viennent d'être rajouté à ${str[0]}`)
        }else{
        db.get("Coins").find({id : mentionvar}).assign({coins : str[1]}).write()
        message.channel.send(`${str[1]} :coin: pièces viennent d'être rajouté à ${str[0]}`)
        }
      }else{
        db.get("Coins").push({id : mentionvar, coins : str[1]}).write()
        message.channel.send(`${str[1]} :coin: pièces viennent d'être rajouté à ${str[0]}`)
      }



    }else{
      message.channel.send("Vous n'avez pas le grade requis !")
    }} 




    const commande10 = "!piece"
    if (message.content.startsWith(commande10)) {
        const str = message.content.substring(commande10.length).trim().split(/ +/);
        console.log(str[0])
        if (str[0] === ""){
    if(!db.get("Coins").find({id : message.author.id}).value()){
      db.get("Coins").push({id : message.author.id, coins : 0}).write()
      message.channel.send("Vous avez 0 pièces :coin:!")
    }else{
      if(db.get("Coins").find({id : message.author.id , coins : 0}).value()){
        message.channel.send("Vous avez 0 pièces :coin:!")
      }else{
      let coinsdb = db.get("Coins").filter({id : message.author.id}).find("coins").value()
      let coinsvar = Object.values(coinsdb)
      message.channel.send(`Vous avez ${coinsvar[1]} pièces :coin:!`)
      }
    }
  }else{
    const mentionvare = getUserFromMention(str[0]).id

    if(!db.get("Coins").find({id : mentionvare}).value()){
      db.get("Coins").push({id : mentionvare, coins : 0}).write()
      message.channel.send(`${str[0]} a 0 pièces :coin:!`)
    }else{
      if(db.get("Coins").find({id : mentionvare , coins : 0}).value()){
        message.channel.send(`${str[0]} a 0 pièces :coin:!`)
      }else{
      let coinsdb = db.get("Coins").filter({id : mentionvare}).find("coins").value()
      let coinsvar = Object.values(coinsdb)
      message.channel.send(`${str[0]} a ${coinsvar[1]} pièces :coin:!`)
      }}

  }


  }

  const commande1 = "!del-piece "

  if (message.content.startsWith(commande1)) {
    if (message.member.roles.cache.some(role => role.name === 'Coins')) {
      const str = message.content.substring(commande1.length).trim().split(/ +/);
      const mentionvar = getUserFromMention(str[0]).id
      if(db.get("Coins").find({id : mentionvar}).value()){
        let coinsdb = db.get("Coins").filter({id : mentionvar}).find("coins").value()
        let coinsvar = Object.values(coinsdb)
        const coinsadd = parseInt(str[1])
        const res = parseInt(coinsvar[1]) - coinsadd
        db.get("Coins").find({id : mentionvar}).assign({coins : res}).write(),
        message.channel.send(`${str[1]} :coin: pièces viennent d'être enlevé à ${str[0]}`)
      }else{
        message.channel.send(`${str[0]} :coin: n'a pas de pièce`)
      }

    }else{
      message.channel.send("Vous n'avez pas le grade requis !")
    }} 

    
  

  




  if(message.content === "!top"){
    const i = 0
    const idvar = []

      while (i === message.guild.memberCount){


      
      if(db.get("Coins").find({coins , id : idd[0] =! idvar}).value()){
      
      const numbers = [13,8,2,21,5,1,3,1];
      const byValue = (a,b) => a - b;
      const sorted = [...numbers].sort(byValue);
      console.log(sorted); // [1,1,2,3,5,8,13,21]
      i += 1
      }
    }



    message.channel.send(``)
  }









})


bot.login(process.env.BOT_TOKEN)
