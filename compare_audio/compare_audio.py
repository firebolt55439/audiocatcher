"""
This file contains code for comparing audio files
for similarity, and returns a number indicating
degree of similarity.
"""

import os, sys
import cgi
import json
import fp
import pipes
import subprocess
import pickle
from os import curdir
from os.path import join as pjoin
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer

EP_PATH = './echoprint-codegen'
API_HOST = 'http://localhost:8080/'
ID_FNAME = 'id.save'
MAP_FNAME = 'map.save'

songMap = {}
lastId = "songid1"

def save_id():
	with open(ID_FNAME, 'wb') as fp:
		fp.write(lastId)
		fp.close()

def save_map():
	with open(MAP_FNAME, 'wb') as fp:
		pickle.dump(songMap, fp)
		fp.close()

def read_id():
	global lastId
	try:
		with open(ID_FNAME, 'rb') as fp:
			lastId = fp.read()
			fp.close()
	except IOError:
		lastId = "songid1"
		pass

def read_map():
	global songMap
	try:
		with open(MAP_FNAME, 'rb') as fp:
			songMap = pickle.load(fp)
			fp.close()
	except IOError:
		songMap = {}
		pass

def learn_song(filename, description):
	global lastId
	cmd = '{} "{}" > song.out'.format(EP_PATH, filename)
	with open('song.out', 'rb') as fp:
		subprocess.call(cmd, shell=True, stdout=fp)
		os.system(cmd)
		data = fp.read()
		fp.close()
	data = json.loads(data.strip())[0]
	#print json.dumps(data, indent=3)
	try:
		fp_code = data["code"]
	except KeyError:
		print "Could not learn song with title: {}".format(description)
		return
	length = data["metadata"]["duration"]
	cmd = 'curl http://localhost:8080/ingest -d "fp_code={}&track_id={}&length={}&codever=4.12" > /dev/null'.format(fp_code, lastId, length)
	songMap[lastId] = description
	lastId = 'songid' + str(int(lastId.split('songid')[1]) + 1)
	save_id()
	save_map()
	os.system(cmd)
	print "Learned song with title: {}".format(description)

def identify_audio(filename):
	"""
	Identify a given song.
	You can provide a filename of some audio. 
	You must provide start time to end time for
	scanning.
	"""
	cmd = '{} "{}" > song.out'.format(EP_PATH, filename)
	os.system(cmd)
	with open('song.out', 'rb') as fp:
		data = fp.read()
		fp.close()
	data = json.loads(data.strip())[0]
	print json.dumps(data, indent=3)
	fp_code = data["code"]
	cmd = 'curl -S http://localhost:8080/query?fp_code={} > song.out'.format(fp_code)
	os.system(cmd)
	with open('song.out', 'rb') as fp:
		data = fp.read()
		fp.close()
	data = json.loads(data.strip())
	print json.dumps(data, indent=3)
	if data["match"]:
		print "SUCCESSFUL MATCH!"
		title = songMap[str(data["track_id"])]
		print "Matched to: {}".format(title)
		return {
			"success": True,
			"match": title,
			"score": data["score"]
		};
	else:
		return {
			"success": False
		};

class StoreHandler(BaseHTTPRequestHandler):
    store_path = pjoin(curdir, 'file.mp3')

    def do_GET(self):
    	print self.path
        if self.path == '/identify':
			self.send_response(200)
			self.send_header('Content-type', 'text/json')
			self.end_headers()
			self.wfile.write(json.dumps(identify_audio("file.mp3")))

if __name__ == '__main__':
	read_id()
	read_map()
	if len(sys.argv) > 1 and sys.argv[1] == "--learn":
		fp.erase_database(True) # clear database on start
		try: os.unlink(ID_FNAME)
		except OSError: pass
		try: os.unlink(MAP_FNAME)
		except OSError: pass
		learn_song('test1.mp3', "FOB - My Songs Know What You Did In The Dark")
		identify_audio('test1.mp3')
		#identify_audio('test1.mp3')
	
		# Now teach it songs for real.
		base_path = "/Users/sumer/Downloads/songs/"
		for file in os.listdir(base_path):
			if file.endswith(".mp3") and os.path.isfile(base_path + file):
				fname = os.path.normpath(base_path + file)	
				print fname
				title = file.split('.mp3')[0]
				learn_song(fname, title)
	print songMap.keys()
	print songMap['songid1']
	#identify_audio('test1.mp3')
	#identify_audio("/Users/sumer/Downloads/songs/Katy Perry - Roar (Official).mp3")
	#identify_audio("/Users/sumer/Downloads/lHTmeklt.mp3")
	
	# Now start serving.
	try:
		server = HTTPServer(('', 8081), StoreHandler)
		server.serve_forever()
	except KeyboardInterrupt:
		os._exit(1)
	