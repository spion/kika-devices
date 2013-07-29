import serial
import sys
import urllib2
import json

#S = serial.Serial("/dev/ttyUSB0")
S = sys.stdin
lst = []

while True:
    T = float(S.readline())
    
    lst.append(T)
    # print float(T)
    if len(lst) >= 1 :
        avg = sum(lst) / len(lst)
        lst = []
        print 'avg=', avg
        try:
            urllib2.urlopen(urllib2.Request("http://localhost:8080/push/update",
                        json.dumps({'type':'temperature', 'values': {'s1':avg}}),
                        {'content-type': 'application/json'}))
        except:
                print "Could not connect to server"




