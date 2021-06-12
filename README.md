# Levi Bot
Levi is a whatsapp bot created with [@open-wa/wa-automate](https://github.com/open-wa/wa-automate-nodejs) and written in typescript.

**P.S.:** Unfotunately usage of bots with outside libraries violates WhatsApp's TOS. So, be aware you can get banned by using this bot, or any bots.

### **Prerequisites**
- [node.js](https://nodejs.org/en/download)
- [typescript](https://www.typescriptlang.org/download)
- [Google Chrome](https://www.google.com/intl/en_en/chrome/)
- [MongoDB](https://www.mongodb.com/)

### **Installation**
Clone the git repository

```bash
> git clone https://github.com/tcortega/levi-ts.git
> cd levi-ts
```

Install all the dependencies, and **be sure you're in the project's directory**

```bash
> npm i
# or using yarn
> yarn
```
### **Bot Setup**
1. Create the `.env` file and fill it based on the `.env.example` located in the repository.
2. Build it
```bash
> npm run build
# or using yarn
> yarn build
```
3. Run it
```bash
> npm start
# or using yarn
> yarn start
```
4. A QR Code will show up in your terminal and then you can just scan it's code using your phone with whatsapp, just as you do to scan WhatsApp's Web QR codes.
5. You can try the bot out by sending any command, for instance, `#help`. You can change the default prefix inside `config.ts`.

### **Troubleshooting**
Make sure all the necessary dependencies are installed.
https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md

Fix Stuck on linux, install google chrome stable:
```bash
> wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
> sudo apt install ./google-chrome-stable_current_amd64.deb
```
### **How to contribute**
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am "Add some feature"`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request
