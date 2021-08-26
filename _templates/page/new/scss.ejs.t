---
to: src/pages/<%= name %>/_<%= h.changeCase.paramCase(name) %>.scss
unless_exists: true
---
.<%= h.changeCase.paramCase(name) %> {

}