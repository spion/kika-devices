iface=`cat .config-iface`
pushurl=`cat .config-db`
arp -ni eth0 | awk '{print $3}' | grep ':' | curl $pushurl --data-binary @- -H"Content-Type:text/plain"
