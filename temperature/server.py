import sys
import urllib2
import json

lst = []

while (True):
    lst.append(float(sys.stdin.readline()));
    if (len(lst) == 6):
        avg = sum(lst) / len(lst)
        lst = []
        urllib2.urlopen(urllib2.Request("http://localhost:8080/push/update",
                json.dumps({'type':'temperature', 'values': {'s1':avg}}),
                {'content-type': 'application/json'})) 
