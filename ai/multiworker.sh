logs="$HOME/simba/ai/logs"
run="$logs/$(ls "$logs" | tail -n 1)"
gen="$run/$(ls -t "$run" | grep -E '^gen_' | head -n 1)"
echo $gen
for i in `seq 10`; do
  time python3 worker.py $gen &
done
wait
