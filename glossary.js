// rules for transforming glossary content from prose to data

var util = require('util'),
    marked = require('marked'),
    extend = require('extend'),
    S = require('string');


var Glossary = {
  transform: function(definition) {
    definition = definition.trim();

    var paragraphs = definition.split(/\n{2,}/);

    // see if the last paragraph has metadata, keep and chop it off if so
    var extras = Glossary.dataFrom(paragraphs[paragraphs.length-1]);
    if (extras) paragraphs = paragraphs.slice(0, paragraphs.length-1);

    definition = paragraphs.join("\n\n");
    var short_definition = paragraphs[0].trim();
    var long_html = marked(definition).trim();
    var long_text = S(long_html).stripTags().s.replace(/\n/g, "\n\n").trim();

    var data = {
      short_definition: short_definition,
      long_definition_html: long_html,
      long_definition_markdown: definition,
      long_definition_text: long_text
    };
    extend(data, extras);

    return JSON.stringify(data);
  },

  // given the final paragraph of a definition, grab data out of it.
  // this is pretty hacky for now.
  dataFrom: function(paragraph) {
    var data = {},
        found = false;

    // check every line in the last paragraph for data
    paragraph.split("\n").forEach(function(line) {
      var regex = new RegExp("^Source:\\s+(.*?)$");
      var match = line.match(regex);
      if (match) {
        var value = match[1];
        // super hack to parse markdown link syntax
        var pieces = value.replace(/^\[/, '').replace(/\)/, '').split(/\]\(/);
        if (pieces[0] && pieces[1]) {
          data.source = pieces[0];
          data.source_url = pieces[1];
          found = true;
        }
      }
    });

    if (found)
      return data;
    else
      return null;
  }
};

module.exports = Glossary;