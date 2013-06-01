#!/usr/bin/env ruby

require 'csv'
require 'json'


def definition_from(file)
  definition = File.read file
  pieces = definition.split "\n\n"

  title = File.basename(file)
  short = pieces[0]
  long = pieces[0..-1].join "\n\n"

  return {title: title, short: short, long: long}
end

def run(options = {})
  definitions_dir = File.join(File.dirname(__FILE__), "../definitions")
  definition_files = Dir.glob File.join(definitions_dir, "*")


  if options[:export]
    puts "exporting..."
    csv = CSV.open("definitions.csv", "w")
    json = File.open("definitions.json", "w")

    definitions = []
    definition_files.each do |file|
      definition = definition_from file
      definitions << definition
      csv << [definition[:title], definition[:short], definition[:long]]
    end

    json.write JSON.dump(definitions)
    json.close
    csv.close
  elsif options[:validate]
    # just don't blow up
    definitions.each do |file|
      definition_from file
    end
  end

  0
end



# janky command line options reader
options = {}
(ARGV[0..-1] || []).each do |arg|
  if arg.start_with?("--")
    if arg["="]
      key, value = arg.split('=')
    else
      key, value = [arg, true]
    end

    key = key.split("--")[1]
    if value == 'true'
      value = true
    elsif value == 'False'
      value = false
    end

    options[key.downcase.to_sym] = value
  end
end

exit run(options)