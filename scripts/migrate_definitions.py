import requests

# change if need be, but end with a trailing slash
definitions_dir = "definitions/"

r = requests.get("https://raw.github.com/statedecoded/legal-dictionary/master/dictionary.json")

content = r.json()
for l in content:
	term = str(l['term'])
	term = term[0].upper() + term[1:]
	definition = l['definition']
	url = l['source_url']
	source = l['source']

	copy = "%s \n\nSource: [%s](%s)" % (definition, source, url)
	copy = copy.encode('ascii', 'ignore')

	file_name = definitions_dir + term
	f = open(file_name, 'w')

	f.write(copy)
	f.close()

