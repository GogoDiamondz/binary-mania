# CS 260 Notes

[My startup - Simon](https://simon.cs260.click)

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)

## AWS

My IP address is: 54.80.53.107

http://54.80.53.107/

Command to get into my remote shell:  ssh -i [key pair file] ubuntu@52.23.193.18

## Caddy

No problems worked just like it said in the [instruction](https://github.com/webprogramming260/.github/blob/main/profile/webServers/https/https.md).

## HTML

This was easy. I was careful to use the correct structural elements such as header, footer, main, nav, and form. The links between the three views work great using the `a` element.

The part I didn't like was the duplication of the header and footer code. This is messy, but it will get cleaned up when I get to React.

Structure for play:
- header
- player name
- friend's name
- winner (hidden until win)
- higher/lower
- input display box
- 0 and 1
- footer

Structure for friends:
- header
- 'Your Friends'
- table containing:
  - friend's name
  - wins
  - losses
  - invite/accept/cancel button or offline status
- table containing:
  - players online
  - friend request/accept/decline button
- footer

Structure for profile:
- header
- "[username]'s profile"
- singleplayer best time
- random duck image
- log out
- footer

## CSS

This took a couple hours to get it how I wanted. It was important to make it responsive and Bootstrap helped with that. It looks great on all kinds of screen sizes.

Bootstrap seems a bit like magic. It styles things nicely, but is very opinionated. You either do, or you do not. There doesn't seem to be much in between.

I did like the navbar it made it super easy to build a responsive header.

I can also used SVG to make the icon and logo for the app:

```html
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#0066aa" rx="10" ry="10" />
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="72" font-family="Arial" fill="white">C</text>
</svg>
```

## React Part 1: Routing

Setting up Vite and React was pretty simple. I had a bit of trouble because of conflicting CSS. This isn't as straight forward as you would find with Svelte or Vue, but I made it work in the end. If there was a ton of CSS it would be a real problem. It sure was nice to have the code structured in a more usable way.

## React Part 2: Reactivity

This was a lot of fun to see it all come together. I had to keep remembering to use React state instead of just manipulating the DOM directly.

Changed layout of game: "Play" now leads to "Game session" which holds capabilities for either multiplayer or singleplayer. Multiplayer is accessible through friends menu.

Needs implementation:
- friend game request
- add current user to online players
- friend requests list and accept button (requests lists can go between friends and online players)
```
