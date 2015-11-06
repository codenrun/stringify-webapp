#include "Stringified_routeMap.h"
#include <map>


typedef   std::map<std::string, char* >  ROUTEMAP;
typedef   std::map<std::string, char* >::iterator  ROUTEMAP_ITR;


namespace stringified{
	ROUTEMAP  routeMap;
};

void stringified::InsertRoute( std::string path, char* g_staticDataPtr){
	routeMap[path] = g_staticDataPtr;
}

bool stringified::FetchData(std::string path,  std::vector<char>& dataVec ){
	ROUTEMAP_ITR  itr = routeMap.findKey(path);
	if( itr==routeMap.end()){
		return false;
	}	
	
	dataVec.clear();
	
	char* data = itr->second;
	
	for( int i = 0; data[i]!=0 ; i++ ){
		dataVec.push_back(data[i]);
	}
	return true;
}