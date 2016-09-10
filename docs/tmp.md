## Architecture
1. node
  1. node.js
2. 22
every field is a (server-data -> output result) mapper

todo:  flow-dynamic/src/validator/undef.js `undefable`
make inner function accept eMsg.
maybe add a passby checker in `graphql-ck.js`
because GraphQL's sourceT.
should or should not dynamic check ResultT?


----------------
basiclly all graphql  type must be resolved to a scale type.
if a none scale type field havnt a resolve, seems Graphql will not resolve that field,
will jump it!!
