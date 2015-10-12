#!/usr/bin/python
"""This is where I will put the code that makes sure that the new temp/load
gets written to the temps/loads .csv files.
"""

from time import sleep
from os import popen

import re

import csv

# Constantos
LOADSCSV = 'loads.csv'
TEMPSCSV = 'temps.csv'

# RegExp
load_re = re.compile('\d+,\d+')
ints = re.compile('\d+')

# Init vars
loads_writer = None
temps_writer = None

while True:
    load_raw = popen('mpstat 1 1').read()
    load = 100.0 - float(load_re.findall(load_raw)[-1].replace(',', '.'))

    temp_raw = popen("sensors | grep 'Physical id 0:'").read()
    temp_raw = temp_raw.replace('\n', '')
    temp_raw = temp_raw.replace('+', '')
    temp = round(float(''.join(ints.findall(temp_raw.split(' ')[4]))),1)

    date = popen('date').read().replace('\n', '')

    with open(LOADSCSV, 'ab') as file:
        loads_writer = csv.writer(file, delimiter=',')
        loads_writer.writerow([date, load])

    with open(TEMPSCSV, 'ab') as file:
        temps_writer = csv.writer(file, delimiter=',')
        temps_writer.writerow([date, load])

    sleep(5)  # 5s
