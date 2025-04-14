#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET    -1
#define SCREEN_ADDRESS 0x3C  // Usually 0x3C

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

const int ecgPin = A0; // ECG analog output connected to A0

void setup() {
  Serial.begin(9600);

  if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("OLED allocation failed"));
    while (true);
  }

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
}

void loop() {
  int ecgValue = analogRead(ecgPin); // Read ECG analog signal

  display.clearDisplay();
  display.setCursor(0, 20);
  display.print("ECG Value:");
  display.setCursor(0, 35);
  display.print(ecgValue);
  display.display();

  Serial.println(ecgValue); // For debugging

  delay(100); // Update speed
}
