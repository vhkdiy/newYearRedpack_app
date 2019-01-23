#!/bin/bash

clear;
source /etc/profile;
Path="`dirname $0`"
bakPath="${Path}/../utils/config.js.bak"
configPath="${Path}/../utils/config.js"
# echo $bakPath;

#***************************************************函数区域***************************************************
#切换到git目录
gitPath(){
    cd $Path
    cd ../
}
#打标签函数
tag(){
    echo -e "\033[31m是否打标签   ->>   (0 : 不打标签  如果打标签直接输入微信版本号(如1.0.625只需要输入625即可)) \033[0m"
    read -p "请输入 : " wxVersion
    if [ "$wxVersion" != "0" ]; then
            gitPath
            time=$(date +%Y-%m-%d『%H-%M-%S』)
            tag="${time}1.0.${wxVersion}版本发布";
            echo -e "\033[33mtag格式 : $tag \033[0m"
            git tag -a $tag -m "上线版本"
            git push origin $tag
    fi
}
#获取SHA1 和说明
getSha1(){
    gitPath
    echo -e "\033[31m提交版本前，请确认本地版本是否是你想提交的版本\033[0m"
    git log --pretty=format:"当前版本的SHA1:%H" -p -1
    # git log --pretty=format:"提交描述:%s" -p -1
}

#切换到测试服
changeTestServer(){
    echo -e "准备启用\033[31m测试\033[0m服"
    echo -e "准备启用\033[31m测试\033[0m服"
    echo -e "准备启用\033[31m测试\033[0m服"
    sed -i '.bak' 's/[ ]*const[ ]*testServer[ ]*=[ ]*\false[ ]*;/const testServer = true;/g' $configPath
    echo -e "\033[32m                                                                  启用测试服 \033[0m"
}
#切换到正式服
changeOfficialServer(){
    echo -e "准备启用\033[31m正式\033[0m服"
    echo -e "准备启用\033[31m正式\033[0m服"
    echo -e "准备启用\033[31m正式\033[0m服"
    sed -i '.bak' 's/[ ]*const[ ]*testServer[ ]*=[ ]*\true[ ]*;/const testServer = false;/g' $configPath
    echo -e "\033[32m                                                                  启用正式服 \033[0m"
}
#切换到上线版本
changeReleaseServer(){
    getSha1
    tag
    changeOfficialServer
}
#打印本地信息
getLocalInfo(){
    echo -e "\033[31m当前配置如下:   ->    请确认\033[0m"
    sed -n '2p'  $configPath
    sed -n '3p'  $configPath
    sed -n '8p'  $configPath
    sed -n '9p'  $configPath
    sed -n '10p' $configPath
    sed -n '11p' $configPath
    sed -n '12p' $configPath
    sed -n '13p' $configPath
    sed -n '14p' $configPath
}
#菜单信息
getMenuInfo(){
    echo -e "\033[31m请选择模式:\033[0m"
    echo -e "\033[33mtrue||1 -> 启用测试服          false || 0 -> 启用正式服\033[0m"
    echo -e "\033[32mrelease ->  上线版                 tag    ->  打标签\033[0m"
    echo -e "\033[36m  sha1  ->   SHA1                 email  ->  发送通知提审邮件\033[0m"
}
# sendEmailBefore(){
#     echo -e "\033[31m是否要发送邮件 0 -> 不发送  1 -> 邮件组(运营、研发、测试)\033[0m"
#     echo -e "\033[31m             2 -> 发测试  3 -> 邮件组(运营、研发、测试、开放)\033[0m"
#     read -p "请选择 : " send
#     if [ "$send" != "1" -a "$send" != "2" -a "$send" != "3" ]; then
#         echo "退出邮件发送"
#     else
#         if [ "$send" == "1" ]; then
#             # sendEmailGroup="365yy@xmiles.cn,365yf@xmiles.cn,ceshi@xmiles.cn"
#             sendEmailGroup="caizifeng@xmiles.cn"
#         elif [ "$send" == "2" ]; then
#             # sendEmailGroup="ceshi@xmiles.cn"
#             sendEmailGroup="caizifeng@xmiles.cn"
#         else
#             # sendEmailGroup="365yy@xmiles.cn,365yf@xmiles.cn,ceshi@xmiles.cn,opendev@xmiles.cn"
#             sendEmailGroup="caizifeng@xmiles.cn"
#         fi
#         echo "准备发送邮件给 -> $sendEmailGroup"
#         echo -e "\033[31m是否需要自定义发送消息？ 1 -> 自定义内容后发送  2 -> 测试通用模板发送\033[0m"
#         echo -e "\033[31m是否需要自定义发送消息？ 3 -> 正式通用模板发送  0 -> 上线通用模板发送\033[0m"
#         read -p "请选择 : " type
#         if [ "$type" == "1" ]; then
#             echo "请输入回答以下问题:"
#             read -p "请输入主题: " title
#             read -p "请输入内容: " text
#             sendEmail $sendEmailGroup $title $text
#         elif [ "$type" == "2" ]; then
#             sendEmail $sendEmailGroup "365测试版本已经更新" "请过流程..."
#         elif [ "$type" == "3" ]; then
#             sendEmail $sendEmailGroup "365正式版本已经更新" "请过流程..."
#         elif [ "$type" == "0" ]; then
#             sendEmail $sendEmailGroup "365步步赚新版即将提交审核" "在此提前通知大家"
#         else
#             echo '您输入的指令无效！请确认后重试！'
#         fi
#     fi
# }

#发送邮件
sendEmail(){
    sendEmail_yf
    # sendEmail_yy
    # sendEmail_open
}
#发送邮件给研发
sendEmail_yf(){
    time=$(date +%Y-%m-%d_%H:%M:%S)
    cd $Path
    # mail -s "365bbz submit for review at ${time}" 365yf@xmiles.cn < mail.txt
    echo '365步步赚已经提交审核了，请各个部门做好过审上线前的准备!' | mail -s "365bbz submit for review at ${time}"   litves@xmiles.cn
}
#发送邮件给研发
sendEmail_yy(){
    time=$(date +%Y-%m-%d_%H:%M:%S)
    cd $Path
    # mail -s "365bbz submit for review at ${time}" 365yy@xmiles.cn < mail.txt
    echo '365步步赚已经提交审核了，请各个部门做好过审上线前的准备!' | mail -s "365bbz submit for review at ${time}"   caizifeng@xmiles.cn
}
#发送邮件给开放平台
sendEmail_open(){
    time=$(date +%Y-%m-%d_%H:%M:%S)
    cd $Path
    # mail -s "365bbz submit for review at ${time}" opendev@xmiles.cn < mail.txt
    echo '365步步赚已经提交审核了，请各个部门做好过审上线前的准备!' | mail -s "365bbz submit for review at ${time}"   huangzhuojie@xmiles.cn,shixiaolu@xmiles.cn
}

#***************************************************函数区域***************************************************



#打印本地信息
getLocalInfo
#打印选择菜单
getMenuInfo

read -p "请选择 : " testServer

if [ "$testServer" == "true" -o "$testServer" == "1" ]; then
    changeTestServer
elif [ "$testServer" == "false" -o "$testServer" == "0" ]; then
    changeOfficialServer
elif [ "$testServer" == "release" ]; then
    changeReleaseServer
    read -p "是否发送版本提审通知邮件 1 -> 发送  其他 -> 不发送" send
    if [ "$send" == "1" ]; then
        sendEmail
    fi
elif [ "$testServer" == "tag" ]; then
    tag
elif [ "$testServer" == "sha1" ]; then
    getSha1
elif [ "$testServer" == "email" ]; then
    sendEmail
else
    echo '您输入的指令无效！请确认后重试！'
fi

#如果是打正式版或者(SHA1)就不执行退出
if [ "$testServer" == "false" -o "$testServer" == "0" -o "$testServer" == "release" -o "$testServer" == "sha1" ]; then
    echo "请确认所选配置是否正确";
else
    exit 0;
fi


