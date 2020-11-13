# workday-theme
Bespoke theme for the RAB Website

script-generator/ contains the development files that we mostly touch in the themes:
- scripts.js
- style.css

To build these files, from script-generator/, run:
`npm install`
`npm run build`

After building, to copy the compiled js file to the themed directories, from script-generator/, run:
`npm run write-js`

After building, to copy the compiled css file to the themed directories, from script-generator/, run:
`npm run write-css`
