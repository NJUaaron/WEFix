# Flaky Test Fixer

This is a simple tool to automatically fix UI-based flaky test. To use this tool, your test must be written in JavaScript using Selenium for end-to-end purpose. You can find in [example](https://github.com/tree/main/example) folder about how a typical test code looks like, and how this tool actually work.

how to install
``` shell
$ npm install --save-dev @aaronxyliu/ftfixer
```

how to update to newest version
``` shell
$ npm update @aaronxyliu/ftfixer
```

how to use
``` shell
# fix example.js file, generate example.fix.js
$ npm <example.js>
```