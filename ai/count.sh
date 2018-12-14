for x in `netgrouplist penguin-lab-sys` `netgrouplist particle-lab-sys` babbage; do ssh -4 $x "echo $x: "'`pgrep -u gstone -c chrome`' & done
wait
