#!/bin/bash
Path=`pwd`
bakPath="${Path}/utils/config.js.bak"
# echo "绝对路径:$bakPath";
if [ -f "$bakPath" ]; then
    rm $bakPath;
fi
open -a Terminal.app "${Path}/shell/check.sh"
until [ -f "$bakPath" ]
do
   echo "请回答终端问题...";
   sleep 1;
done
echo "结束"
exit;




