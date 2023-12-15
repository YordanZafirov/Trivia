import {
  BlobWriter,
  HttpReader,
  TextReader,
  ZipWriter,
} from "https://unpkg.com/@zip.js/zip.js/index.js";

onmessage = async (e) => {
  const { correctScore, wrongAnswers, questionCount } = e.data;
  const resultPercentage = Math.round((correctScore / questionCount) * 100);
  const text = `You answered ${correctScore} questions correctly and ${wrongAnswers} questions incorrectly. Your result is ${resultPercentage}%`;
  const zipWriter = new ZipWriter(new BlobWriter("application/zip"));
  await zipWriter.add("QuizScore.txt", new TextReader(text))
  const blob = await zipWriter.close()
  postMessage(blob)
};
