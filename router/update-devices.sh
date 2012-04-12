iface=`cat .config-iface`
userpasshost=`cat .config-db`
arp -i $iface | curl http://$userpasshost/kika-devices/_design/couchapp/_update/devices --data-binary @- -H"Content-Type:text/plain"
