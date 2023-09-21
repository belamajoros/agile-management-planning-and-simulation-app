const tf = require('@tensorflow/tfjs');
const tfn = require('@tensorflow/tfjs-node');

const handler = tfn.io.fileSystem('././tensorflow/model/model.json');

const use = require('@tensorflow-models/universal-sentence-encoder');

const encodeData = async (encoder, tasks) => {
  const sentences = tasks.map((t) => {
    return t.text.toLowerCase();
  });
  const embeddings = await encoder.embed(sentences);
  return embeddings;
};

/**
 * @create Prediction
 * @desc Using model for prediction of position for specific task
 * @param {String} taskName description of task
 * @return {String} Predictioned role
 */
module.exports.predictionRole = async (taskName) => {
  const loadedModel = await tf.loadLayersModel(handler);
  const sentenceEncoder = await use.load();
  const xPredict = await encodeData(sentenceEncoder, [{ text: taskName }]);
  const prediction = await loadedModel.predict(xPredict).dataSync();
  const indexOfPrediction = prediction.indexOf(Math.max(...prediction));

  switch (indexOfPrediction) {
    case 0:
      return 'Front-end web developer';
    case 1:
      return 'Back-end web developer';
    case 2:
      return 'Designer';
    case 3:
      return 'Database administrator';
    case 4:
      return 'IT security specialist';
    case 5:
      return 'Quality assurence tester';
    case 6:
      return 'Documentation editor';
    default:
      return prediction;
  }
};
