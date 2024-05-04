rm -rf output
mkdir output

# https://trac.ffmpeg.org/wiki/Create%20a%20thumbnail%20image%20every%20X%20seconds%20of%20the%20video
# tile敷き詰め方式 shot per 10(30fps * 10)sec
ffmpeg -i another_sky.webm -filter_complex \
    "select='not(mod(n,300))',setpts='N/(30*TB)',scale=240:-1,tile=layout=10x10" \
    -vsync vfr output/%04d.jpg -f null

# シーンチェンジ検出方式
# ffmpeg -i another_sky.webm -vf \
#     "select=gt(scene\,1.0), scale=640:360,showinfo" \
#     -vsync vfr output/%04d.jpg -f null - 2>ffout
