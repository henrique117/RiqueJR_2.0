# RIQUE JR (Beta Version)

> Status: Developing

## Description:

- Hi! This is a Discord application I created to study more about JavaScript and the Discord.js library. I also used Sequelize to create a local storage to store some information.


## The Project:

- I started this project after a failed attempt at creating a Discord bot. After Discord.js updated to v14, I decided to give up. However, after some time, I started it again, adding a lot of new features, making it much better than the previous version.


## Commands and Functions:

- Rique Jr. has a lot of functionalities, most of them created for fun and personal study. Check out the commands:

  + ### 1. For Fun Commands:
    + <h4>Freedozera: </h4>Just an embed I made for fun for a friend of mine, studying Discord embeds.
    + <h4>Pika: </h4>One of the first commands I made; it's simple and pretty fun as well.
    + <h4>Ping: </h4>Pong!!
    
  + ### 2. Study Stuff:
    + <h4>CriptRSA: </h4>I made this one for a school homework that I thought would be cool to implement with code.
    + <h4>DecriptRSA: </h4>The reverse of the CriptRSA command.
  

  ## Sequelize and Coins:

  - After creating those commands, I wanted to work on something more challenging. I came up with the idea of a currency system for my bot to make it even more fun! By signing up on the bot using the <code>/register</code> command, you can access the following features:

   + ### 1. Basic Currency Commands:
     + <h4>Wallet: </h4>Check how many coins you have in your account.
     + <h4>Pix: </h4>Transfer any amount of coins to another user.
     + <h4>Show: </h4>Display a list of all the bot users.
     
   + ### 2. Earning Coins:
     + <h4>Daily: </h4>By typing <code>$daily</code> in any chat, you can redeem 200 coins every 12 hours. The daily reset occurs at 9am and 9pm, allowing you to claim it again.

   + ### 3. Admin and Control Commands (Only I can use these):
     + <h4>Add: </h4>Add an amount of coins to a user.
     + <h4>Remove: </h4>Remove an amount of coins from a user.
     + <h4>Delete: </h4>Delete any record from the database.
     + <h4>Reset: </h4>Reset the <code>$daily</code> for everyone.
     + <h4>Bonus: </h4>Give an amount of coins to all registered users.


  ## The Games:

  - This is the most exciting part of the project. I've coded two simple games to play and spend your coins on bets, allowing you to try to multiply your coins and be the top player on the list:

   + ### 1. "The Tigrinho":
     
     - This game is quite simple. You have a chance to multiply the coins you bet. Just type <code>**$tigrinho {value}**</code> to bet any amount and try to multiply it:
       
       ![image](https://github.com/henrique117/RiqueJR_2.0/assets/86057591/328daa1a-62e5-4456-b3d9-b53367e921f5)

     - The chances of multiplying or losing your coins are updated in the <code>/tabela</code> command, which is an embed showing the chances of winning any multiplier.
    
   + ### 2. Russian Roulette:
     
     - The most complex part of my project so far. By using the <code>/rr {value}</code> command, a Russian Roulette game will start. It consists of a six-bullet gun, with one bullet being real and the other five fake. You can choose to shoot or not by clicking the <code>Continuar</code> button to shoot or the <code>Cancelar</code> button to stop playing and keep your winnings:
    
       ![image](https://github.com/henrique117/RiqueJR_2.0/assets/86057591/29f85285-b86a-494b-86c5-996e6281724f)

     - The more you shoot, the more you win. The multiplier applies based on how many shots you take until you stop or win the game. Remember, you have a chance to shoot a real bullet and lose the game.

  ## Code:

  - All the code is open-source since I used it for study and personal improvement. I am a Computer Science student working on my degree. If anyone has any comments about the code and how I can improve it, feel free to DM me on my social media:
 
    + #### Instagram: [@henrique_moreira177](https://www.instagram.com/henrique_moreira177/)
    + #### Twitter: [@henr1que177](https://x.com/henr1que177)
    + #### Discord: iccy11706 (Feel free to send a friend request :D)
    + #### Linkedin: [Henrique Moreira](https://www.linkedin.com/in/henrique-moreira-274b8027b/)
   
  ## Bot Invite:

  - Since this bot is in a development state, please be patient with it. If you want to try using it, it will be glad to join your server! You can invite it by clicking [here!](https://discord.com/oauth2/authorize?client_id=875759536131145738&permissions=8&scope=bot)

  ## Patch Notes (1.3 - 03/06)

  - New command added: <code>/update</code>: This command updates your nickname in the table if you have changed it on Discord.

  - AuditLog: Now that I've allowed others to add the bot to their servers, I felt the need to know what is happening with the bot even when I'm not in the server. Therefore, I created a table that stores the history of actions performed by Rique Jr.

#### Coded by Henrique Assis Moreira, Computer Science Student at UFLA