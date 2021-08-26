---
inject: true
to: src/App.scss
append: true
---
@import "./pages/<%= name %>/<%= h.changeCase.paramCase(name) %>.scss";