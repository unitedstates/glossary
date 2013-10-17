// rules for transforming glossary content from prose to data

var util = require('util'),
    marked = require('marked'),
    S = require('string');


var Glossary = {
  transform: function(definition) {
    var short_definition = definition.split("\n\n")[0];
    var long_html = marked(definition);
    var long_text = S(long_html).stripTags().s.replace(/\n/g, "\n\n");

    return JSON.stringify({
      short_definition: short_definition,
      long_definition_html: long_html,
      long_definition_markdown: definition,
      long_definition_text: long_text
    });
  }
};

module.exports = Glossary;