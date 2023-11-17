cls

start "TapmerMonkey Server" node dev/bin/www
start firefox -P Funke -url http://localhost:3000/ -url moz-extension://a7f72f90-8547-4f95-9f88-9c4e5558f7f3/options.html#nav=dashboard

