fx_version "cerulean"

description "Basic React (TypeScript) & Lua Game Scripts Boilerplate"
author "Project Error"
version '1.0.0'
repository 'https://github.com/project-error/fivem-react-boilerplate-lua'

lua54 'yes'

games {
  "gta5",
  "rdr3"
}

ui_page 'web/build/index.html'


shared_scripts {
  '@ox_lib/init.lua',
  'shared/**/*',
}

client_script "client/**/*"
server_scripts {
  "@oxmysql/lib/MySQL.lua",
  "server/**/*"
}


shared_scripts {
  '@es_extended/imports.lua', -- Import ESX functions and PlayerData
  '@es_extended/locale.lua', -- Import the Locale system
}

files {
	'web/build/index.html',
	'web/build/**/*',
}