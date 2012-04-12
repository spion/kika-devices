userpasshost=`cat .config`
echo arp -i eth1 x-pipe-x curl http://$userpasshost/kika-devices/_design/couchapp/_update/devices --data-binary @- -H"Content-Type:text/plain"
