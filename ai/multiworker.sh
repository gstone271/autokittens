logs="$HOME/simba/ai/logs"
run="$logs/$(ls "$logs" | tail -n 1)"
gen="$run/$(ls -t "$run" | grep -E '^gen_' | head -n 1)"
echo $gen
output=`mktemp`
for i in `seq 10`; do
  /usr/bin/time -p python3 worker.py $gen >>$output 2>&1 &
done
wait
<$output python3 -c '
import sys
lines = [ line for line in sys.stdin if len(line) > 0 ]
totals = {}
for line in lines:
  split = line.split(" ")
  prefix = split[0] if len(split) > 1 else ""
  totals[prefix] = totals.get(prefix, 0) + float(split[-1])
print(totals)
'
rm $output
