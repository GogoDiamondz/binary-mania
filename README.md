# Binary Mania

[My Notes](notes.md)

The ultimate binary number guessing game! Your only hope: a hint of higher or lower. Compete against time--and against friends--to guess the right number.

## 🚀 Specification Deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] Proper use of Markdown
- [x] A concise and compelling elevator pitch
- [x] Description of key features
- [x] Description of how you will use each technology
- [x] One or more rough sketches of your application. Images must be embedded in this file using Markdown image references.

### Elevator pitch

Do you dare to try your luck... in binary? The binary mania game is a number-guessing game where you can compete against friends in real time to guess the correct binary number! Be sure to know your counting, because the only hint is whether the number is higher or lower than your guess. Binary mania inspires fun competition, as the scoreboard tracks every win and loss you have against your components. Binary mania will have you thinking in binary in no time.

### Design

![Sign In](sign_in.jpg)
![Main Menu](main_menu.jpg)
![Game Session](game_session.jpg)
![Scoreboard](scoreboard.jpg)

### Key features

- Secure log in over HTTPS
- Ability to input binary numbers
- Countdown timer in single-player mode
- Display higher/lower for guesses
- Game stops for both players when a player wins
- Scoring wins/losses against players

### Technologies

I am going to use the required technologies in the following ways.

- **HTML** - Uses 4 HTML pages: home, play, friends, and profile
- **CSS** - Applying styling that spaces the interactable buttons and text appropriately for different screen sizes
- **React** - Provides sign-in and buttons to input guesses
- **Service** - Backend service endpoints for:
    - sign-in
    - retrieving a number
    - submitting guesses
    - submitting scores
    - retrieving scores
- **DB/Login** - Stores users, friends, and scores in the database. Register and sign in users.
- **WebSocket** - When a player in multiplayer wins, the game is stopped for all players and the winner is announced.

## 🚀 AWS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Server deployed and accessible with custom domain name** - [My server link](https://binarymania.click).

## 🚀 HTML deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **HTML pages** - index, play, friends, and profile
- [x] **Proper HTML element usage** - headers, footers, tables, text, img, etc.
- [x] **Links** - nav links and github link
- [x] **Text** - headers, descriptions, footers, etc.
- [x] **3rd party API placeholder** - duck image
- [x] **Images** - duck image
- [x] **Login placeholder** - home page
- [x] **DB data placeholder** - friends tables, profile info, and login
- [x] **WebSocket placeholder** - play with friends, announce winner in play

## 🚀 CSS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Visually appealing colors and layout. No overflowing elements.** - I did not complete this part of the deliverable.
- [ ] **Use of a CSS framework** - I did not complete this part of the deliverable.
- [ ] **All visual elements styled using CSS** - I did not complete this part of the deliverable.
- [ ] **Responsive to window resizing using flexbox and/or grid display** - I did not complete this part of the deliverable.
- [ ] **Use of a imported font** - I did not complete this part of the deliverable.
- [ ] **Use of different types of selectors including element, class, ID, and pseudo selectors** - I did not complete this part of the deliverable.

## 🚀 React part 1: Routing deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Bundled using Vite** - I did not complete this part of the deliverable.
- [ ] **Components** - I did not complete this part of the deliverable.
- [ ] **Router** - I did not complete this part of the deliverable.

## 🚀 React part 2: Reactivity deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **All functionality implemented or mocked out** - I did not complete this part of the deliverable.
- [ ] **Hooks** - I did not complete this part of the deliverable.

## 🚀 Service deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Node.js/Express HTTP service** - I did not complete this part of the deliverable.
- [ ] **Static middleware for frontend** - I did not complete this part of the deliverable.
- [ ] **Calls to third party endpoints** - I did not complete this part of the deliverable.
- [ ] **Backend service endpoints** - I did not complete this part of the deliverable.
- [ ] **Frontend calls service endpoints** - I did not complete this part of the deliverable.
- [ ] **Supports registration, login, logout, and restricted endpoint** - I did not complete this part of the deliverable.

## 🚀 DB deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Stores data in MongoDB** - I did not complete this part of the deliverable.
- [ ] **Stores credentials in MongoDB** - I did not complete this part of the deliverable.

## 🚀 WebSocket deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Backend listens for WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Frontend makes WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Data sent over WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **WebSocket data displayed** - I did not complete this part of the deliverable.
- [ ] **Application is fully functional** - I did not complete this part of the deliverable.
