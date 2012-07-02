import serial
import sys
import urllib2
import json

S = serial.Serial("/dev/ttyUSB0")
lst = []
S.flushInput()
T = S.readline()

while True:
    T = float(S.readline())
    
    lst.append(T)
    # print float(T)
    if len(lst) >= 20 :
        avg = sum(lst) / len(lst)
        lst = []
        # print 'a'
        try:
                urllib2.urlopen(urllib2.Request("http://prisutni.spodeli.org/push/update",                
                        json.dumps({'type':'temperature', 'values': {'s1':avg}}),
                        {'content-type': 'application/json'}))
        except:
                print "Could not connect to server"




