for x in `netgrouplist penguin-lab-sys` `netgrouplist particle-lab-sys` babbage; do ssh -4 $x "bash -c 'pkill -u $USER chromedriver; pkill -u $USER chrome; pkill -u $USER python;'" & done; wait
