#!/bin/bash

#basePath='/root/kika-devices';

# Automatic basePath with bash
# Used because the cron may run the script from a different working directory
basePath="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

iface=`cat $basePath/.config-iface`
pushurl=`cat $basePath/.config-url`
arp -ni $iface | awk '{print $3}' | grep ':' | sort | uniq | curl $pushurl --data-binary @- -H"Content-Type:text/plain"


