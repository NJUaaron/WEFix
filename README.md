# Flaky Test Fixer

## For Users
This is a simple tool to automatically fix UI-based flaky test. To use this tool, your test must be written in JavaScript using Selenium for end-to-end testing purpose. You can find in [example](https://github.com/NJUaaron/UI-Flaky-Test-Fixer/tree/main/example) folder about how a typical test code looks like, and how this tool actually work.

how to install?
``` shell
$ npm install --save-dev @aaronxyliu/ftfixer
```

how to update to newest version?
``` shell
$ npm update @aaronxyliu/ftfixer
```

how to use?
``` shell
# help manual
$ npx @aaronxyliu/ftfixer --help

# open ui panel to show mutation record
$ npx @aaronxyliu/ftfixer ui
```


## For Developers
How to deploy?
``` shell
$ npm install
```

How to minify JS file?
``` shell
$ npx minify lib/mutationObserver.js > lib/mutationObserver.min.js
```

How to publish to NPM?
``` shell
$ npm run git-push
$ npm run deploy
```

How to test?
``` shell
node .\bin\ftfixer.js -h
```

How to contact the author?  
Please email to `xliu234@buffalo.edu`

All the mutation record will be saved in `.mutationslog` file, located in root directory.
