OData query string parser for node.js based on [pegjs](http://pegjs.majda.cz/).

This is a fork of auth0/node-odata-parser. What I wanted is to be able to write odata like queries that can be parsed to a structure that is consumable for mongodb filter query format.

Modifications: 
- reduced odata operator set to those which is supported by mongodb
- filterExpression creates a filter structure that is consumable for mongodb

## Original Author

[Auth0](auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
