
import os
import shutil

def stringifyFile( filePath ):
	print "stringifying ", filePath ; 
	
	varname = os.path.basename(filePath)
	varname = varname.replace("-", "_") ;
	varname = varname.replace(".", "_dot_");
	
	data = open(filePath, "rb").read();
	
	cstring = '#include "Stringified_routeMap.h"\n'	
	
	cstring =  cstring + 'namespace stringified{\n';	

	cDataString = "\t\t";
	collen = 0;
	for ch in data:
		cDataString = cDataString +  "0x"+ch.encode("hex") + ",";
		collen=collen+1;
		if(collen == 30):
			collen = 0;
			cDataString = cDataString +"\n\t\t";	
			
	cstring = cstring + '\tchar g_' + varname+  '[] = {\n'  +  cDataString +  ' 0x00 \n\t};\n';	
	
	cstring = cstring + '};';	
	
	cstringold = "";
	try:
		cFile = open( "out\\" + "Stringified_paths" + ".cpp", "r");
		cstringold = cFile.read();
		cFile.close();
	except:
		pass;
		
	cFile = open( "out\\" + "Stringified_paths"+  ".cpp", "w");
	cFile.write(  cstringold + cstring)
	cFile.close();
	
	
	return    (filePath.replace("\\" , '/') , 'g_'+varname )
	
	
def stringifyDir(dirPath):
	
	stringifiedFileList = [];
	
	dir_list=os.listdir(dirPath);

	for file_name in dir_list:
		if not os.path.isdir(dirPath + file_name) :
			stringifiedFileList.append(stringifyFile(dirPath + file_name));
		else:
			stringifiedFileList = stringifiedFileList + stringifyDir(dirPath + file_name+"/")
			
	return stringifiedFileList
	
	
def makeAppLoader( routeMap ):
	cstring = '#include "Stringified_loader.h"\n'	
	cstring = cstring + '#include "Stringified_routeMap.h"\n'	
	
	cstring = cstring + " void stringified::Load(){\n"
	for route in routeMap:
		cstring = cstring + "\textern char " +  route[1]  +  "[]; \n";
		cstring = cstring + "\tstringified::InsertRoute(" + '"' +route[0] + '"' +"," + route[1]  +  "); \n";
	cstring = cstring + "}\n"

	
	
	cFile = open( "out\\" + "Stringified_loader" + ".cpp", "w");
	cFile.write(cstring)
	cFile.close();


	
shutil.copytree("template", "out");
makeAppLoader(stringifyDir("app/"));



