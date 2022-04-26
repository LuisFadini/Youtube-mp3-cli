#!/usr/bin/env node

import ytdl from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import pathToFfmpeg from "ffmpeg-static";
import chalk from "chalk";

ffmpeg.setFfmpegPath(pathToFfmpeg);

const url = process.argv.slice(2)[0];
if (url) {
  if (!ytdl.validateURL(url)) {
    console.log("Invalid Youtube URL!");
  } else {
    (async () => {
      try {
        const info = (await ytdl.getInfo(url)).videoDetails,
          stream = ytdl(`${url}`, {
            quality: "highestaudio",
          });
        let title = info.title.replace(/[\/\\:\"\*?<>|]/g, "");

        clearTitleEnd();

        function clearTitleEnd() {
          if (title.endsWith(" ")) {
            title = title.slice(0, -1);
            clearTitleEnd();
          } else {
            try {
              ffmpeg(stream)
                .audioBitrate(128)
                .save(`${process.cwd()}/${title}.mp3`)
                .on("start", (p) => {
                  console.log(
                    chalk.green(
                      `Started downloading ${chalk.blue(`"${title}"`)}.`
                    )
                  );
                })
                .on("end", () => {
                  console.log(chalk.green("Download completed with success!"));
                });
            } catch (error) {
              console.log(error);
              console.log(chalk.red("An error occurred!"));
            }
          }
        }
      } catch (err) {
        console.log(chalk.red("An error occured!"));
      }
    })();
  }
} else {
  console.log("Please provide a Youtube URL as an argument!");
}
