basePath='/root/kika-devices';


echo 'ARP' > $basePath/arp
iface=`cat $basePath/.config-iface`
pushurl=`cat $basePath/.config-url`
arp -ni $iface >> $basePath/arp
cat $basePath/arp  | awk '{print $3}' | grep ':' | sort | uniq | curl $pushurl --data-binary @- -H"Content-Type:text/plain"


