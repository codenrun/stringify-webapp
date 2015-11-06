#ifndef _STRINGIFIED_ROUTE_MAP_H_
#define _STRINGIFIED_ROUTE_MAP_H_


#include <vector>


namespace stringified{
	
	bool FetchData(std::string path,  std::vector<char>& dataVec );

	void InsertRoute( std::string path, char* g_staticDataPtr);
};

#endif
