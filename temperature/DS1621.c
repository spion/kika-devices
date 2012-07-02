#include <Wire.h>

#define DEV_ID 0x90 >> 1                        // shift required by wire.h


void setup()
{
    Serial.begin(9600);

    Wire.begin();
    Wire.beginTransmission(DEV_ID);             // connect to DS1621 (#0)
    Wire.send(0xAC);                            // Access Config
    Wire.send(0x02);                            // set for continuous conversion
    Wire.beginTransmission(DEV_ID);             // restart
    Wire.send(0xEE);                            // start conversions
    Wire.endTransmission();
}


void loop()
{
    int8_t firstByte;
    int8_t secondByte;
    float temp = 0;

    delay(1000);                                // give time for measurement

    Wire.beginTransmission(DEV_ID);
    Wire.send(0xAA);                            // read temperature command
    Wire.endTransmission();
    Wire.requestFrom(DEV_ID, 2);		// request two bytes from DS1621 (0.5 deg. resolution)

    firstByte = Wire.receive();		        // get first byte
    secondByte = Wire.receive();		// get second byte

    temp = firstByte;

    if (secondByte)			        // if there is a 0.5 deg difference
        temp += 0.5;

    Serial.println(temp);

}
