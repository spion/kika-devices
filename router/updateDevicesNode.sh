#! /bin/bash
BASEDIR=$(readlink -f $(dirname $0))

source "$BASEDIR/.config"

/usr/sbin/arp -ni $IFACE |
    grep "ether.*$IFACE" |
    awk '{print $3}' | 
    sort | 
    uniq |
curl -q $PUSHURL --data-binary @- -H"Content-Type:text/plain"
