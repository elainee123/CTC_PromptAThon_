line = 'C "/home/john/ics 32/my notebooks" -n my_diary'
print(line[line.find('"')+1:line.find('"',line.find('"')+1)])