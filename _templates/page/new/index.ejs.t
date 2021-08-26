---
to: src/pages/<%= name %>/index.js
unless_exists: true
---
import <%= name %> from "./<%= name %>"
export default <%= name %>