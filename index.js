var ffmpeg = require('fluent-ffmpeg');
var fs = require('fs');
var config = require('./config.json');

// ffmpeg for windows
// ffmpeg.setFfmpegPath('bin/ffmpeg.exe');
// ffmpeg.setFfprobePath('bin/ffplay.exe');
// ffmpeg.setFlvtoolPath('bin/flvtool2.exe');

var rtmp = config.youtubeURL + '/' + config.youtubeKey;
var files = fs.readdirSync(config.musicfolder);
var img = config.imagesfolder;

for (var i in files) {
  files[i] = files[i].slice(0, -4);
}

var number = 0;
stream(number);


function stream(i){
  ffmpeg(`${config.musicfolder}/${files[i]}.mp3`).withVideoCodec('libx264').withAudioCodec('libmp3lame')
  .withAudioChannels(2).withAudioBitrate('128k')
  .addInput(img +'/image%d.png').size('1280x720').aspect('16:9').videoFilters({
    filter: 'drawtext',
    options: {
      fontfile:'font/SourceSansPro-Regular.ttf',
      text: files[i],
      fontsize: 36,
      fontcolor: 'white',
      x: '(main_w/2-text_w/2)',
      y: 50,
      shadowcolor: 'black',
      shadowx: 2,
      shadowy: 2
    }
  }).loop()
  .toFormat('flv')
  .addOptions(['-preset veryfast',
  '-g 50', '-keyint_min 60', '-maxrate 3000k','-b:v 512k', '-crf 25',
  '-bufsize 3000k', '-ar 44100', '-pix_fmt yuv420p','-shortest','-tune zerolatency'])
  .on('start', function(it){
    return console.log('FFmpeg start with ' + it);
  })
  .on('progress', function(progress){
    return console.log('FFmpeg in '+progress.timemark);
  })
  .on('end', function(){
    number += 1;
    if (number < files.length) {
      stream(number);
    } else{
      number = 0;
      stream(number);
    }
    return console.log('FFmpeg end.');
  })
  .save(rtmp).on('error', function(err, stdout, stderr) {
    console.log('Cannot process video: ' + err.message + '\n\n' + stdout + '\n\n'+ stderr);
    });
}





// .withAudioBitrate('712k')
// .withAudioFrequency(48000)
