# 出力時に指定したdarと縦幅でリサイズする。16:9で縦幅1080pxに横幅を自動に合わせる。
# 録画開始5秒前に実行
ffmpeg -re -dual_mono_mode main -i http://192.168.40.71:40772/api/channels/GR/21/services/3274001056/stream -sn -threads 3 -c:a libvorbis -ar 48000 -b:a 192k -ac 2 -c:v libvpx-vp9 -vf yadif,setsar=1,setdar=dar=16/9,scale="(dar*oh):1080" -b:v 6000k -deadline realtime -speed 4 -t 9 -cpu-used -8 -y -f webm out.webm
