---
inject: true
to: src/App.scss
append: true
---
@import "./components/<%= name %>/<%= h.changeCase.paramCase(name) %>.scss";