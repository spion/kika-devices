

lockfile='.lockfile'
date >> log
if [ ! -e $lockfile ]
then
   touch $lockfile
   iface=`cat .config-iface`
   pushurl=`cat .config-url`
   arp -ni $iface | awk '{print $3}' | grep ':' | curl $pushurl --data-binary @- -H"Content-Type:text/plain"  critical-section
   rm $lockfile
   echo "Successful update"
else
   echo "attempting to push macs while previous push in progress" >> log
fi


