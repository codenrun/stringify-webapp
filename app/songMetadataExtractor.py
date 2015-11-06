import os
import eyed3
import json
from mutagen import File



def normalizeStr(str):
	return str.replace("'","-");

def noarmalizeSongFile( songFilePath ):
	if '\'' in songFilePath :
		print "renaming ", songFilePath , "==>", normalizeStr(songFilePath)
		os.rename(songFilePath , normalizeStr(songFilePath))

def makeDB():
	
	
	songDirPath = "./songs/";

	dir_list=os.listdir(songDirPath);

	for file_name in dir_list:
		if not os.path.isdir(songDirPath + file_name) :
			filename, file_extension = os.path.splitext(file_name)
			if file_extension != ".mp3" :
				continue;
			noarmalizeSongFile(songDirPath + file_name );	
			
				
				

	songList = [];
	dir_list=os.listdir(songDirPath);
	for file_name in dir_list:
		if not os.path.isdir(songDirPath + file_name) :
			filename, file_extension = os.path.splitext(file_name)
			if file_extension != ".mp3" :
				continue;
			songList.append( songDirPath + file_name );
		
	print songList;	

	

	songMetaDic = {};
	songMetaDic["songs"] = [];
	
	
	artistMetaDic = {};
	
	albumMetaDic = {};
	
	
	
	
	
	for songFilePath in songList:
		try:
			file = File(song) 
			artwork = file.tags['APIC:'].data 
			with open( songFilePath+ '.jpg', 'wb') as img:
				img.write(artwork)
		except :
			pass;
			
			
	for songFilePath in songList:
		song = { }
		song["path"] = songFilePath;
		
		if os.path.isfile( songFilePath+ '.jpg'):
			song["thumbpath"] = songFilePath+ '.jpg';
		else:
			song["thumbpath"]  = "resources/defaultAlbumArt.jpg";	
			
		print songFilePath;

		try:
			meta = eyed3.load(songFilePath)
			
			if meta.tag.title is None:
				song["title"] =  os.path.basename(songFilePath)
			else:
				song["title"] =  normalizeStr(meta.tag.title)

			if meta.tag.artist is None:
				song["artist"] =  "Unknown"
			else:
				song["artist"] =  normalizeStr(meta.tag.artist)

			if meta.tag.album is None:
				song["album"] =  "Unknown"
			else:
				song["album"] =  normalizeStr(meta.tag.album )
	
		except:
			
			song["title"] =  os.path.basename(songFilePath)
			song["artist"] = "Unknown"
			song["album"] =  "Unknown"
			pass;
		
		
		#update song Meta
		songMetaDic["songs"].append(song);		

		#update artist Meta
		if artistMetaDic.has_key(song["artist"]):
			artistMetaDic[song["artist"]].append( song );
		else:
			artistMetaDic[song["artist"]] = [ song ];	
		
		
		
		#update album Meta
		if albumMetaDic.has_key(song["album"]):
			albumMetaDic[song["album"]].append( song );
		else:
			albumMetaDic[song["album"]] = [ song ];	
		
	
	songlistJSON = open("songlist.json", "w");
	songlistJSON.write(json.dumps(songMetaDic))
	songlistJSON.close();
	
	
	artistlist= [];
	for key, value in zip( artistMetaDic.keys(), artistMetaDic.values()):
		artist = {};
		artist["name"] = key;
		artist["songs"] = value;
		artistlist.append(artist);
		
	artistlistJSON = open("artistlist.json", "w");
	artistlistJSON.write(json.dumps(artistlist))
	artistlistJSON.close();
	
	albumlist= [];
	for key, value in zip( albumMetaDic.keys(), albumMetaDic.values()):
		album = {};
		album["name"] = key;
		album["songs"] = value;
		albumlist.append(album);
	
	albumlistJSON = open("albumlist.json", "w");
	albumlistJSON.write(json.dumps(albumlist))
	albumlistJSON.close();
	
	
if __name__ == "__main__":
	makeDB()