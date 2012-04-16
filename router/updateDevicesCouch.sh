iface=`cat .config-iface`
userpasshostdb=`cat .config-db`
arp -ni $iface | awk '{print $3}' > tmp
curl "$userpasshostdb/_design/couchapp/_update/status/0_people" --data-binary @tmp
curl "$userpasshostdb/_design/couchapp/_update/devices" --data-binary @tmp
