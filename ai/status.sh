for x in `netgrouplist penguin-lab-sys` `netgrouplist particle-lab-sys` babbage; do ping -c 1 -4 $x >/dev/null 2>/dev/null || echo "Computer down: $x" & done
wait
