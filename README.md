# Smash-PaperReader
A intelligent paper reader with basic reading features, including highlighting, note-taking, PaperCopilot, and more.

Front-End built with [webpack](https://webpack.js.org/), [Mantine v6](https://v6.mantine.dev/pages/getting-started/) and [pdf-component-library](https://github.com/allenai/pdf-component-library).
Back-End built with [Flask](https://flask.palletsprojects.com/en/stable/) and [papermage](https://github.com/allenai/papermage).
The Front-End and Back-end communicate with [Socket.IO](https://socket.io/).

## Features
### StartPage

· Start reading with a valid URL.
· Start reading with a local PDF file

### ReaderPage
· Navigation bar:

1. Control the content displayed in the left pane and right pane.
2. Jump to the StartPage.
3. settings (not implement...).
4. Jump to the UserPage (not implement...).

· Interaction Area (left pane) :

1. Ask **PaperCopilot** questions related to the paper.
2. Browse the **Thumbnail**.
3. Browse the **Outline**.

· Reading Area (mid pane) :

1. Display the paper.
2. **Toolbar** :   NoteTaking，Translate，Highlight，Explain，Copy.
3. Select the highlight color on the right side of the paper.
4. Zoom Control on the bottom of the Page.

· Digest Area (right pane) :

Display the AI conclusion and content related to the knowledge base (deving...)
## GettingStart
```
cd './frontend'
```

```
npm install
```

```
npm start
```

If you encounter the following error during $start$:
```
Error: error:0308010C:digital envelope routines::unsupported
```

Maybe you can try the command before $start$:
```
$env:NODE_OPTIONS="--openssl-legacy-provider"
```
