#! /bin/bash
BASEDIR=$(readlink -f $(dirname $0))

source "$BASEDIR/.config"

DATA=$(arp -ni $IFACE | awk '{print $3}')
curl "$COUCHDB/_design/couchapp/_update/status/0_people" --data-binary "$DATA"
curl "$COUCHDB/_design/couchapp/_update/devices" --data-binary "$DATA"
