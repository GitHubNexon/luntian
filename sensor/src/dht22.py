import adafruit_dht
import board
import time

dht_device = adafruit_dht.DHT22(board.D4)  # GPIO 4

while True:
    try:
        temperature = dht_device.temperature
        humidity = dht_device.humidity
        print(f"Temp: {temperature:.1f}°C  Humidity: {humidity:.1f}%")
    except RuntimeError as error:
        print(error.args[0])  # Common for DHT sensors, just retry
    time.sleep(0.5)
