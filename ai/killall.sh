for x in `netgrouplist penguin-lab-sys` `netgrouplist particle-lab-sys` babbage; do ssh -q $x "bash -c 'pkill chromedriver; pkill chrome; pkill python;'" & done
