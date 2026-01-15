# Chess with Friends - Setup Guide

Welcome to your chess game! This guide will help you set up multiplayer features and deploy your website for free.

## 🎮 Quick Start (Local Testing)

1. Open `index.html` in your web browser
2. You can play chess locally on the same computer
3. For online multiplayer with friends, follow the Firebase setup below

## 🔥 Firebase Setup (For Online Multiplayer)

Firebase is a free service by Google that lets you store game data in the cloud so friends can play from different computers.

### Step 1: Create a Firebase Account

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Sign in with your Google account
3. Click "Add project"
4. Enter a project name (e.g., "my-chess-game")
5. Disable Google Analytics (you don't need it)
6. Click "Create project"

### Step 2: Enable Realtime Database

1. In your Firebase project, click "Realtime Database" in the left menu
2. Click "Create Database"
3. Choose a location closest to you
4. Select "Start in **test mode**" (this allows anyone to read/write)
5. Click "Enable"

⚠️ **Important for Security**: Test mode is fine for playing with friends, but if you make this public later, you'll want to add security rules.

### Step 3: Get Your Firebase Configuration

1. Click the gear icon (⚙️) next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon (`</>`)
5. Register your app with a nickname (e.g., "Chess Web App")
6. Copy the `firebaseConfig` object

### Step 4: Update Your Website

1. Open `firebase-config.js` in a text editor
2. Replace the placeholder values with your Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "paste-your-api-key-here",
    authDomain: "your-project-id.firebaseapp.com",
    databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

3. Save the file
4. Now your multiplayer features will work!

## 🚀 Free Hosting Options

Here are the best free ways to host your chess website:

### Option 1: GitHub Pages (Recommended for Beginners)

**Pros**: Free, easy, works great for simple websites

1. Create a GitHub account at [github.com](https://github.com)
2. Create a new repository (name it "my-chess-game")
3. Upload all your files (index.html, style.css, chess.js, firebase-config.js)
4. Go to repository Settings → Pages
5. Under "Source", select "main" branch
6. Click Save
7. Your site will be live at: `https://your-username.github.io/my-chess-game`

**Tutorial Video**: Search YouTube for "GitHub Pages tutorial" for visual guides

### Option 2: Netlify

**Pros**: Very easy drag-and-drop, automatic updates

1. Go to [netlify.com](https://netlify.com)
2. Sign up for free
3. Drag and drop your project folder
4. Your site goes live instantly!
5. You get a URL like: `https://random-name.netlify.app`

### Option 3: Vercel

**Pros**: Fast, professional, similar to Netlify

1. Go to [vercel.com](https://vercel.com)
2. Sign up for free
3. Click "Add New Project"
4. Import from GitHub or upload files
5. Deploy!

### Option 4: Firebase Hosting

**Pros**: Since you're already using Firebase, it's integrated

1. Install Node.js from [nodejs.org](https://nodejs.org)
2. Open terminal/command prompt
3. Run: `npm install -g firebase-tools`
4. Run: `firebase login`
5. Run: `firebase init hosting`
6. Run: `firebase deploy`

Your site will be at: `https://your-project-id.web.app`

## 🎯 How to Play with Friends

### Starting a Game

1. Open your website
2. Click "Create New Game"
3. Copy the 6-character Game ID
4. Send the Game ID to your friend (via text, Discord, etc.)
5. Wait for them to join

### Joining a Game

1. Open the website
2. Click "Join Existing Game"
3. Enter the Game ID your friend sent you
4. Click "Join Game"
5. Start playing!

## 📝 Files Explained

- **index.html** - The structure of your webpage
- **style.css** - Makes everything look pretty (colors, layout, etc.)
- **chess.js** - The game logic (how pieces move, whose turn it is, etc.)
- **firebase-config.js** - Connects to Firebase for online multiplayer

## 🔧 Customization Ideas

As you learn more, you can:

- Change colors in `style.css`
- Add a timer for each move
- Add a chat feature
- Keep track of captured pieces
- Add sound effects
- Create an animated background
- Add player names

## 🐛 Troubleshooting

### "Multiplayer not configured" message
- Make sure you've updated `firebase-config.js` with your Firebase credentials
- Check that you've enabled Realtime Database in Firebase

### Can't see the game
- Make sure all 4 files are in the same folder
- Try opening in a different browser (Chrome works best)

### Game ID doesn't work
- Make sure you copied the full 6-character code
- Check that both players are connected to the internet
- Game IDs are case-sensitive (but auto-uppercase)

## 📚 Learning Resources

To improve this project, learn:

- **HTML/CSS basics**: [freecodecamp.org](https://freecodecamp.org)
- **JavaScript**: [javascript.info](https://javascript.info)
- **Firebase**: [firebase.google.com/docs](https://firebase.google.com/docs)

## ⏭️ Next Steps

1. Test the game locally
2. Set up Firebase for multiplayer
3. Deploy to one of the free hosting services
4. Share with friends and play!
5. Customize and add your own features

Have fun coding and playing chess! 🎉♟️
