fx_version 'cerulean'
game 'gta5'

author 'IO'
description 'una bella interfaccia'
version '0.9.9'

lua54 'yes'

server_scripts{
    'server.lua',
	'@oxmysql/lib/MySQL.lua',
} 

client_scripts{
	'client.lua',
} 

ui_page 'html/guestPage.html'

files {
	
	'html/*',
	'html/Menu/*',
	'html/Ordina/*',
	'html/Prenota/*',
	'html/Main/*',
	
}