for i in *.gif; do
    [ -f "$i" ] || break
        echo "this is ${i%%.*}"
        ffmpeg -f gif -i $i ${i%%.*}.mp4
done
