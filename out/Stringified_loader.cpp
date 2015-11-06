#include "Stringified_loader.h"
#include "Stringified_routeMap.h"
 void stringified::Load(){
	extern char g_albumlist_dot_json[]; 
	stringified::InsertRoute("app/albumlist.json",g_albumlist_dot_json); 
	extern char g_artistlist_dot_json[]; 
	stringified::InsertRoute("app/artistlist.json",g_artistlist_dot_json); 
	extern char g_index_dot_html[]; 
	stringified::InsertRoute("app/index.html",g_index_dot_html); 
	extern char g_defaultAlbumArt_dot_jpg[]; 
	stringified::InsertRoute("app/resources/defaultAlbumArt.jpg",g_defaultAlbumArt_dot_jpg); 
	extern char g_angular_dot_js[]; 
	stringified::InsertRoute("app/scripts/angular.js",g_angular_dot_js); 
	extern char g_app_dot_js[]; 
	stringified::InsertRoute("app/scripts/app.js",g_app_dot_js); 
	extern char g_jquery_dot_min_dot_js[]; 
	stringified::InsertRoute("app/scripts/jquery.min.js",g_jquery_dot_min_dot_js); 
	extern char g_songlist_dot_json[]; 
	stringified::InsertRoute("app/songlist.json",g_songlist_dot_json); 
	extern char g_songMetadataExtractor_dot_py[]; 
	stringified::InsertRoute("app/songMetadataExtractor.py",g_songMetadataExtractor_dot_py); 
	extern char g_test_dot_html[]; 
	stringified::InsertRoute("app/test.html",g_test_dot_html); 
}
